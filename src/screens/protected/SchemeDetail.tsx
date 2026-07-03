import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, ListRenderItem, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import AppButton from '../../components/common/AppButton';
import ErrorState from '../../components/common/ErrorState';
import InvestmentSheet from '../../components/common/InvestmentSheet';
import LoadingState from '../../components/common/LoadingState';
import { getSchemeDetail } from '../../services/api';
import { Colors, Radius, normalize } from '../../themes';
import type {
  NavEntry,
  RootStackParamList,
  SchemeDetailResponse,
} from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'SchemeDetail'>;

const NavSeparator = () => <View style={styles.divider} />;

const SchemeDetail = ({ route }: Props) => {
  const { schemeCode, schemeName } = route.params;
  const insets = useSafeAreaInsets();
  const [detail, setDetail] = useState<SchemeDetailResponse>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sheetVisible, setSheetVisible] = useState(false);

  const loadDetail = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setDetail(await getSchemeDetail(schemeCode));
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'NAV history could not be loaded.',
      );
    } finally {
      setLoading(false);
    }
  }, [schemeCode]);

  useEffect(() => {
    loadDetail();
  }, [loadDetail]);

  const confirmInvestment = (amount: number) => {
    setSheetVisible(false);
    Toast.show({
      type: 'success',
      text1: 'Investment Confirmed',
      text2: `Rs. ${amount.toLocaleString('en-IN')} invested successfully.`,
      position: 'top',
      visibilityTime: 4000,
      autoHide: true,
    });
  };

  const renderNav: ListRenderItem<NavEntry> = ({ item, index }) => (
    <View style={styles.navRow}>
      <View>
        <Text style={styles.navLabel}>
          {index === 0 ? 'LATEST NAV' : 'DATE'}
        </Text>
        <Text style={styles.date}>{item.date}</Text>
      </View>
      <View style={styles.navValueBlock}>
        <Text style={styles.navLabel}>NAV VALUE</Text>
        <Text style={styles.navValue}>Rs. {item.nav}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <LoadingState message="Loading NAV history..." />
      ) : error ? (
        <ErrorState message={error} onRetry={loadDetail} />
      ) : (
        <FlatList
          data={detail?.data ?? []}
          keyExtractor={(item, index) => `${item.date}-${index}`}
          renderItem={renderNav}
          contentContainerStyle={[
            styles.list,
            { paddingBottom: Math.max(insets.bottom, 16) + 96 },
          ]}
          ItemSeparatorComponent={NavSeparator}
          ListHeaderComponent={
            <View>
              <View style={styles.hero}>
                <Text style={styles.schemeName}>{schemeName}</Text>
                <Text style={styles.schemeCode}>Scheme code {schemeCode}</Text>
                {detail?.meta.fund_house ? (
                  <View style={styles.metaPill}>
                    <Text style={styles.metaText}>
                      {detail.meta.fund_house}
                    </Text>
                  </View>
                ) : null}
              </View>

              <View style={styles.sectionHeader}>
                <View>
                  <Text style={styles.sectionTitle}>NAV history</Text>
                  <Text style={styles.sectionSubtitle}>
                    {detail?.data.length.toLocaleString()} records
                  </Text>
                </View>
                <View style={styles.livePill}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveText}>Updated</Text>
                </View>
              </View>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>No NAV records available</Text>
              <Text style={styles.emptyText}>
                This scheme does not currently have published history.
              </Text>
            </View>
          }
        />
      )}

      {!loading && !error ? (
        <View
          style={[
            styles.actionBar,
            { paddingBottom: Math.max(insets.bottom, 12) },
          ]}
        >
          <AppButton
            title="Invest in this fund"
            onPress={() => setSheetVisible(true)}
          />
        </View>
      ) : null}



      <InvestmentSheet
        visible={sheetVisible}
        schemeName={schemeName}
        onClose={() => setSheetVisible(false)}
        onConfirm={confirmInvestment}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  list: {
    paddingHorizontal: normalize(20),
  },
  hero: {
    borderRadius: Radius.lg,
    backgroundColor: Colors.primaryDark,
    padding: normalize(22),
    marginTop: normalize(10),
    overflow: 'hidden',
  },
  schemeName: {
    color: Colors.surface,
    fontSize: normalize(20),
    lineHeight: normalize(28),
    fontWeight: '800',
  },
  schemeCode: {
    color: '#BBD6CF',
    fontSize: normalize(13),
    marginTop: normalize(9),
  },
  metaPill: {
    alignSelf: 'flex-start',
    borderRadius: Radius.pill,
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingVertical: normalize(6),
    paddingHorizontal: normalize(10),
    marginTop: normalize(18),
  },
  metaText: {
    color: '#E7F4F0',
    fontSize: normalize(11),
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: normalize(26),
    marginBottom: normalize(12),
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: normalize(19),
    fontWeight: '800',
  },
  sectionSubtitle: {
    color: Colors.textSecondary,
    fontSize: normalize(12),
    marginTop: normalize(3),
  },
  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: normalize(6),
    borderRadius: Radius.pill,
    backgroundColor: Colors.successSoft,
    paddingVertical: normalize(7),
    paddingHorizontal: normalize(10),
  },
  liveDot: {
    width: normalize(7),
    height: normalize(7),
    borderRadius: normalize(4),
    backgroundColor: Colors.success,
  },
  liveText: {
    color: Colors.success,
    fontSize: normalize(11),
    fontWeight: '700',
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: normalize(74),
    backgroundColor: Colors.surface,
    paddingHorizontal: normalize(16),
  },
  navLabel: {
    color: Colors.textSecondary,
    fontSize: normalize(9),
    fontWeight: '700',
    letterSpacing: normalize(0.7),
  },
  date: {
    color: Colors.text,
    fontSize: normalize(14),
    fontWeight: '600',
    marginTop: normalize(5),
  },
  navValueBlock: {
    alignItems: 'flex-end',
  },
  navValue: {
    color: Colors.primary,
    fontSize: normalize(15),
    fontWeight: '800',
    marginTop: normalize(5),
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: normalize(60),
  },
  emptyTitle: {
    color: Colors.text,
    fontSize: normalize(17),
    fontWeight: '700',
  },
  emptyText: {
    color: Colors.textSecondary,
    fontSize: normalize(13),
    textAlign: 'center',
    marginTop: normalize(7),
  },
  actionBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: normalize(20),
    paddingTop: normalize(12),
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.surface,
  },
});

export default SchemeDetail;
