import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../utils/colors';
import { RootStackParamList } from '../navigation/AppNavigator';
import { getQuickAccessConfig, QuickAccessConfig } from '../services/quickAccessService';
import { getDefaultMenuItems } from '../services/schoolSidebarService';
import { SidebarMenuItem } from '../components/school';
import { useAuth } from '../contexts';
import SchoolLayout from '../components/school/SchoolLayout';

type QuickAccessScreenProps = NativeStackScreenProps<RootStackParamList, 'QuickAccess'>;

// Skeleton component for loading state
const SkeletonBox: React.FC<{ width?: number | string; height?: number; borderRadius?: number }> = ({
  width = 100,
  height = 20,
  borderRadius = 4,
}) => (
  <View
    style={[
      styles.skeleton,
      { width, height, borderRadius } as any,
    ]}
  />
);

const StatCardSkeleton: React.FC = () => (
  <View style={styles.statCard}>
    <SkeletonBox width={40} height={40} borderRadius={8} />
    <SkeletonBox width={60} height={28} borderRadius={4} />
    <SkeletonBox width={50} height={14} borderRadius={4} />
  </View>
);

const QuickActionSkeleton: React.FC = () => (
  <View style={styles.quickActionItem}>
    <View style={styles.quickActionLeft}>
      <SkeletonBox width={40} height={40} borderRadius={8} />
      <View style={styles.quickActionText}>
        <SkeletonBox width={120} height={16} borderRadius={4} />
        <SkeletonBox width={150} height={12} borderRadius={4} />
      </View>
    </View>
    <SkeletonBox width={20} height={20} borderRadius={4} />
  </View>
);

const QuickAccessScreen: React.FC<QuickAccessScreenProps> = ({ route, navigation }) => {
  const { user } = useAuth();
  const schoolId = route.params?.schoolId || 0;

  const [config, setConfig] = useState<QuickAccessConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  const fetchConfig = useCallback(async () => {
    if (!schoolId) {
      setError('School ID is required');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(undefined);

    try {
      const result = await getQuickAccessConfig(schoolId);
      if (result.success && result.config) {
        setConfig(result.config);
      } else {
        setError(result.error || 'Failed to load');
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  }, [schoolId]);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleQuickAction = (actionId: string) => {
    // TODO: Navigate to specific action screens
    console.log('Quick action:', actionId);
  };

  const renderSkeleton = () => (
    <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
      {/* Stats Grid Skeleton */}
      <View style={styles.statsGrid}>
        {[1, 2, 3, 4].map((i) => (
          <StatCardSkeleton key={i} />
        ))}
      </View>

      {/* Quick Actions Skeleton */}
      <View style={styles.section}>
        <SkeletonBox width={100} height={18} borderRadius={4} />
        <View style={styles.quickActionsList}>
          {[1, 2, 3].map((i) => (
            <QuickActionSkeleton key={i} />
          ))}
        </View>
      </View>

      {/* Setup Progress Skeleton */}
      <View style={styles.setupCard}>
        <SkeletonBox width="100%" height={60} borderRadius={12} />
        <SkeletonBox width={100} height={36} borderRadius={8} />
      </View>
    </ScrollView>
  );

  const renderContent = () => {
    if (!config) return null;

    return (
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {/* Welcome Message */}
        <Text style={styles.welcomeMessage}>{config.welcomeMessage}</Text>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {config.stats.map((stat) => (
            <View key={stat.id} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}>
                <Ionicons name={stat.icon as any} size={20} color={stat.color} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>QUICK ACTIONS</Text>
          <View style={styles.quickActionsList}>
            {config.quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.quickActionItem}
                onPress={() => handleQuickAction(action.id)}
                activeOpacity={0.7}
              >
                <View style={styles.quickActionLeft}>
                  <View style={styles.quickActionIcon}>
                    <Ionicons name={action.icon as any} size={20} color={colors.schoolNavy} />
                  </View>
                  <View style={styles.quickActionText}>
                    <Text style={styles.quickActionTitle}>{action.title}</Text>
                    <Text style={styles.quickActionSubtitle}>{action.subtitle}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Setup Progress Card */}
        {config.setupProgress && (
          <View style={styles.setupCard}>
            <View style={styles.setupContent}>
              <Text style={styles.setupMessage}>{config.setupProgress.message}</Text>
            </View>
            <TouchableOpacity
              style={styles.setupButton}
              onPress={() => handleQuickAction(config.setupProgress?.ctaAction || '')}
              activeOpacity={0.8}
            >
              <Text style={styles.setupButtonText}>{config.setupProgress.ctaText}</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    );
  };

  const menuItems: SidebarMenuItem[] = getDefaultMenuItems('owner');
  const currentMenuItem = 'quick_access';

  const handleMenuItemPress = (item: SidebarMenuItem) => {
    if (item.accessible && item.route !== 'QuickAccess') {
      navigation.navigate(item.route as any, { schoolId });
    }
  };

  const handleBackToSchools = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  // Disable hardware back button on school pages
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      // Only allow back via "Back to My Schools" button
      return true;
    });
    return () => backHandler.remove();
  }, []);

  // Render the quick access content
  const renderQuickAccessContent = () => {
    if (!config) return null;
    return (
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.welcomeMessage}>{config.welcomeMessage}</Text>
        <View style={styles.statsGrid}>
          {config.stats.map((stat) => (
            <View key={stat.id} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}>
                <Ionicons name={stat.icon as any} size={20} color={stat.color} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>QUICK ACTIONS</Text>
          <View style={styles.quickActionsList}>
            {config.quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.quickActionItem}
                onPress={() => console.log('Action:', action.id)}
                activeOpacity={0.7}
              >
                <View style={styles.quickActionLeft}>
                  <View style={styles.quickActionIcon}>
                    <Ionicons name={action.icon as any} size={20} color={colors.schoolNavy} />
                  </View>
                  <View style={styles.quickActionText}>
                    <Text style={styles.quickActionTitle}>{action.title}</Text>
                    <Text style={styles.quickActionSubtitle}>{action.subtitle}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
        {config.setupProgress && (
          <View style={styles.setupCard}>
            <View style={styles.setupContent}>
              <Text style={styles.setupMessage}>{config.setupProgress.message}</Text>
            </View>
            <TouchableOpacity
              style={styles.setupButton}
              onPress={() => console.log('CTA:', config.setupProgress?.ctaAction)}
              activeOpacity={0.8}
            >
              <Text style={styles.setupButtonText}>{config.setupProgress.ctaText}</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    );
  };

  return (
    <SchoolLayout
      schoolId={schoolId}
      schoolName={config?.school.name || 'School'}
      menuItems={menuItems}
      activeItem={currentMenuItem}
      onMenuItemPress={handleMenuItemPress}
      onBackToSchools={handleBackToSchools}
      onProfilePress={() => navigation.navigate('AccountSettings')}
    >
      {loading ? renderSkeleton() : error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.textMuted} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchConfig}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        renderQuickAccessContent()
      )}
    </SchoolLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginRight: 40,
  },
  profileButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  welcomeMessage: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 24,
    lineHeight: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.textSecondary,
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  quickActionsList: {
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  quickActionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  quickActionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  quickActionText: {
    flex: 1,
  },
  quickActionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  quickActionSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  setupCard: {
    backgroundColor: colors.schoolNavy,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  setupContent: {
    marginBottom: 16,
  },
  setupMessage: {
    fontSize: 14,
    color: colors.white,
    lineHeight: 20,
  },
  setupButton: {
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignSelf: 'flex-start',
  },
  setupButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.schoolNavy,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: colors.schoolNavy,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  retryText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },
  skeleton: {
    backgroundColor: colors.border,
  },
});

export default QuickAccessScreen;
