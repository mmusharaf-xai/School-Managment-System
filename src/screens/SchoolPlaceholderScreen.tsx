import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  BackHandler,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../utils/colors';
import { RootStackParamList } from '../navigation/AppNavigator';
import SchoolLayout from '../components/school/SchoolLayout';
import { getDefaultMenuItems } from '../services/schoolSidebarService';
import { SidebarMenuItem } from '../components/school';

type SchoolPlaceholderScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Staffs' | 'Students' | 'Assets' | 'Invoices' | 'Classes' | 'Settings' | 'SchoolPlaceholder'
>;

const SchoolPlaceholderScreen: React.FC<SchoolPlaceholderScreenProps> = ({
  route,
  navigation,
}) => {
  // Extract moduleName from params (different routes have different param shapes)
  const params = route.params as any;
  const moduleName = params?.moduleName || route.name;
  const schoolId = params?.schoolId || 0;

  const menuItems: SidebarMenuItem[] = getDefaultMenuItems('owner');

  // Find active item based on current route
  const getActiveItem = (): string => {
    const routeName = route.name.toLowerCase();
    const mapping: Record<string, string> = {
      quickaccess: 'quick_access',
      staffs: 'staffs',
      students: 'students',
      assets: 'assets',
      invoices: 'invoices',
      classes: 'classes',
      settings: 'settings',
    };
    return mapping[routeName] || 'quick_access';
  };

  const handleMenuItemPress = (item: SidebarMenuItem) => {
    if (item.accessible && item.route !== route.name) {
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

  return (
    <SchoolLayout
      schoolId={schoolId}
      schoolName={params?.schoolName || 'School'}
      menuItems={menuItems}
      activeItem={getActiveItem()}
      onMenuItemPress={handleMenuItemPress}
      onBackToSchools={handleBackToSchools}
      onProfilePress={() => navigation.navigate('AccountSettings')}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons
            name="construct-outline"
            size={64}
            color={colors.textMuted}
          />
        </View>
        <Text style={styles.title}>Coming Soon</Text>
        <Text style={styles.description}>
          The {moduleName} module is currently under development.
          {'\n'}
          This page will be available soon.
        </Text>
        <View style={styles.infoCard}>
          <Ionicons name="information-circle-outline" size={20} color={colors.schoolAccent} />
          <Text style={styles.infoText}>
            This module is not yet accessible. Please check back later or contact support for more information.
          </Text>
        </View>
      </View>
    </SchoolLayout>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    maxWidth: 300,
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});

export default SchoolPlaceholderScreen;
