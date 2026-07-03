import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import ErrorState from '../../components/common/ErrorState';
import LoadingState from '../../components/common/LoadingState';
import { useAuth } from '../../context/AuthContext';
import { getSchemes, searchSchemes } from '../../services/api';
import { Colors, Radius, normalize } from '../../themes';
import type { RootStackParamList, Scheme } from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'SchemeList'>;

const SchemeSeparator = () => <View style={styles.separator} />;

const LIMIT = 30;

const SchemeList = ({ navigation }: Props) => {
  const { signOut } = useAuth();
  const insets = useSafeAreaInsets();
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchResults, setSearchResults] = useState<Scheme[]>([]);
  const [showTooltip, setShowTooltip] = useState(false);

  const loadSchemes = useCallback(async (isRefresh = false, searchQuery = '') => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError('');

    try {
      if (searchQuery.trim()) {
        const results = await searchSchemes(searchQuery);
        setSearchResults(results);
        setSchemes(results.slice(0, LIMIT));
        setHasMore(results.length > LIMIT);
        setPage(1);
      } else {
        const initialPage = 1;
        const data = await getSchemes(initialPage, LIMIT);
        setSchemes(data);
        setHasMore(data.length === LIMIT);
        setPage(initialPage);
      }
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'The schemes could not be loaded.',
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Debounce the query input to prevent excessive API requests
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  // Load schemes when the debounced query changes
  useEffect(() => {
    loadSchemes(false, debouncedQuery);
  }, [debouncedQuery, loadSchemes]);

  const loadMoreSchemes = useCallback(async () => {
    if (loading || loadingMore || !hasMore) {
      return;
    }

    setLoadingMore(true);

    try {
      const nextPage = page + 1;
      if (debouncedQuery.trim()) {
        const startIndex = (nextPage - 1) * LIMIT;
        const endIndex = startIndex + LIMIT;
        const nextChunk = searchResults.slice(startIndex, endIndex);

        setSchemes(prev => {
          const existingIds = new Set(prev.map(s => s.schemeCode));
          const uniqueNewData = nextChunk.filter(s => !existingIds.has(s.schemeCode));
          setHasMore(searchResults.length > endIndex && uniqueNewData.length > 0);
          return [...prev, ...uniqueNewData];
        });
        setPage(nextPage);
      } else {
        const data = await getSchemes(nextPage, LIMIT);
        setSchemes(prev => {
          const existingIds = new Set(prev.map(s => s.schemeCode));
          const uniqueNewData = data.filter(s => !existingIds.has(s.schemeCode));
          setHasMore(data.length === LIMIT && uniqueNewData.length > 0);
          return [...prev, ...uniqueNewData];
        });
        setPage(nextPage);
      }
    } catch (requestError) {
      console.warn('Error loading more schemes:', requestError);
    } finally {
      setLoadingMore(false);
    }
  }, [loading, loadingMore, hasMore, page, debouncedQuery, searchResults]);

  const resultCountText = useMemo(() => {
    if (debouncedQuery.trim()) {
      return `${searchResults.length.toLocaleString()} schemes found`;
    }
    return `${schemes.length.toLocaleString()} schemes loaded`;
  }, [debouncedQuery, searchResults.length, schemes.length]);

  const renderScheme: ListRenderItem<Scheme> = useCallback(
    ({ item }) => (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${item.schemeName}, scheme code ${item.schemeCode}`}
        onPress={() =>
          navigation.navigate('SchemeDetail', {
            schemeCode: item.schemeCode,
            schemeName: item.schemeName,
          })
        }
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      >
        <View style={styles.fundMark}>
          <Text style={styles.fundMarkText}>
            {item.schemeName.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.cardCopy}>
          <Text style={styles.schemeName} numberOfLines={2}>
            {item.schemeName}
          </Text>
          <Text style={styles.schemeCode}>Scheme code {item.schemeCode}</Text>
        </View>
        <Text style={styles.chevron}>›</Text>
      </Pressable>
    ),
    [navigation],
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good to see you</Text>
          <Text style={styles.title}>Explore funds</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Profile menu"
          hitSlop={8}
          onPress={() => setShowTooltip(prev => !prev)}
          style={styles.profileButton}
        >
          <Text style={styles.profileText}>SM</Text>
        </Pressable>
      </View>

      {showTooltip && (
        <>
          <Pressable style={styles.tooltipOverlay} onPress={() => setShowTooltip(false)} />
          <View style={[styles.tooltip, { top: insets.top + 66 }]}>
            <View style={styles.tooltipArrow} />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Log out"
              onPress={() => {
                setShowTooltip(false);
                signOut();
              }}
              style={styles.logoutButton}
            >
              <Text style={styles.logoutText}>Log out</Text>
            </Pressable>
          </View>
        </>
      )}

      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>⌕</Text>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search by scheme name"
          placeholderTextColor={Colors.textSecondary}
          selectionColor={Colors.primary}
          autoCorrect={false}
          returnKeyType="search"
          style={styles.searchInput}
        />
        {query ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Clear search"
            hitSlop={8}
            onPress={() => setQuery('')}
          >
            <Text style={styles.clear}>×</Text>
          </Pressable>
        ) : null}
      </View>

      {!loading && !error ? (
        <Text style={styles.resultCount}>
          {resultCountText}
        </Text>
      ) : null}

      {loading ? (
        <LoadingState message="Finding available schemes..." />
      ) : error ? (
        <ErrorState message={error} onRetry={() => loadSchemes(false, debouncedQuery)} />
      ) : (
        <FlatList
          data={schemes}
          renderItem={renderScheme}
          keyExtractor={item => String(item.schemeCode)}
          contentContainerStyle={[
            styles.list,
            schemes.length === 0 && styles.emptyList,
          ]}
          ItemSeparatorComponent={SchemeSeparator}
          keyboardShouldPersistTaps="handled"
          initialNumToRender={12}
          maxToRenderPerBatch={16}
          windowSize={9}
          onEndReached={loadMoreSchemes}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingMore ? (
              <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color={Colors.primary} />
              </View>
            ) : null
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => loadSchemes(true, debouncedQuery)}
              tintColor={Colors.primary}
              colors={[Colors.primary]}
            />
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>No schemes found</Text>
              <Text style={styles.emptyText}>
                Try a different fund or asset manager name.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: normalize(20),
    paddingTop: normalize(16),
  },
  greeting: {
    color: Colors.textSecondary,
    fontSize: normalize(13),
  },
  title: {
    color: Colors.text,
    fontSize: normalize(29),
    lineHeight: normalize(36),
    fontWeight: '800',
  },
  profileButton: {
    width: normalize(44),
    height: normalize(44),
    borderRadius: normalize(22),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primarySoft,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  profileText: {
    color: Colors.primaryDark,
    fontSize: normalize(14),
    fontWeight: '700',
  },
  searchBox: {
    height: normalize(52),
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
    marginHorizontal: normalize(20),
    marginTop: normalize(22),
    paddingHorizontal: normalize(14),
  },
  searchIcon: {
    color: Colors.textSecondary,
    fontSize: normalize(24),
    marginRight: normalize(9),
    transform: [{ rotate: '-20deg' }],
  },
  searchInput: {
    flex: 1,
    height: '100%',
    color: Colors.text,
    fontSize: normalize(15),
  },
  clear: {
    color: Colors.textSecondary,
    fontSize: normalize(24),
    lineHeight: normalize(26),
  },
  resultCount: {
    color: Colors.textSecondary,
    fontSize: normalize(12),
    fontWeight: '600',
    paddingHorizontal: normalize(22),
    marginTop: normalize(14),
    marginBottom: normalize(5),
  },
  list: {
    paddingHorizontal: normalize(20),
    paddingTop: normalize(8),
    paddingBottom: normalize(28),
  },
  card: {
    minHeight: normalize(92),
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
    padding: normalize(14),
  },
  cardPressed: {
    opacity: 0.72,
    transform: [{ scale: 0.995 }],
  },
  fundMark: {
    width: normalize(44),
    height: normalize(44),
    borderRadius: normalize(14),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primarySoft,
  },
  fundMarkText: {
    color: Colors.primaryDark,
    fontSize: normalize(18),
    fontWeight: '800',
  },
  cardCopy: {
    flex: 1,
    marginLeft: normalize(13),
    marginRight: normalize(8),
  },
  schemeName: {
    color: Colors.text,
    fontSize: normalize(14),
    lineHeight: normalize(20),
    fontWeight: '700',
  },
  schemeCode: {
    color: Colors.textSecondary,
    fontSize: normalize(12),
    marginTop: normalize(5),
  },
  chevron: {
    color: Colors.textSecondary,
    fontSize: normalize(27),
    fontWeight: '300',
  },
  separator: {
    height: normalize(10),
  },
  emptyList: {
    flexGrow: 1,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: normalize(80),
  },
  emptyTitle: {
    color: Colors.text,
    fontSize: normalize(18),
    fontWeight: '700',
  },
  emptyText: {
    color: Colors.textSecondary,
    fontSize: normalize(14),
    textAlign: 'center',
    marginTop: normalize(7),
  },
  footerLoader: {
    paddingVertical: normalize(15),
    alignItems: 'center',
    justifyContent: 'center',
  },
  tooltipOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 99,
  },
  tooltip: {
    position: 'absolute',
    right: normalize(12),
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: normalize(12),
    paddingHorizontal: normalize(20),
    zIndex: 100,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  tooltipArrow: {
    position: 'absolute',
    top: normalize(-6),
    right: normalize(25),
    width: normalize(10),
    height: normalize(10),
    backgroundColor: Colors.surface,
    borderLeftWidth: 1,
    borderTopWidth: 1,
    borderColor: Colors.border,
    transform: [{ rotate: '45deg' }],
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    color: Colors.error,
    fontSize: normalize(14),
    fontWeight: '600',
  },
});

export default SchemeList;
