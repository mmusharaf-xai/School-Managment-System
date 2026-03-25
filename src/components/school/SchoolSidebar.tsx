import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../utils/colors';

export interface SidebarMenuItem {
  id: string;
  label: string;
  icon: string;
  route: string;
  accessible: boolean;
}

interface SchoolSidebarProps {
  schoolName: string;
  schoolLogo?: string | null;
  menuItems: SidebarMenuItem[];
  activeItem?: string;
  onItemPress: (item: SidebarMenuItem) => void;
  onBackToSchools: () => void;
}

const SchoolSidebar: React.FC<SchoolSidebarProps> = ({
  schoolName,
  menuItems,
  activeItem,
  onItemPress,
  onBackToSchools,
}) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Ionicons name="school" size={24} color={colors.white} />
          </View>
          <Text style={styles.schoolName} numberOfLines={1}>
            {schoolName}
          </Text>
        </View>
      </View>

      {/* Menu Items */}
      <ScrollView style={styles.menuList} showsVerticalScrollIndicator={false}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.menuItem,
              activeItem === item.id && styles.menuItemActive,
            ]}
            onPress={() => onItemPress(item)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={item.icon as any}
              size={20}
              color={activeItem === item.id ? colors.white : colors.textSecondary}
            />
            <Text
              style={[
                styles.menuLabel,
                activeItem === item.id && styles.menuLabelActive,
              ]}
            >
              {item.label}
            </Text>
            {!item.accessible && (
              <Ionicons
                name="lock-closed-outline"
                size={16}
                color={colors.textMuted}
                style={styles.lockIcon}
              />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Bottom: Back to My Schools */}
      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBackToSchools}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={18} color={colors.schoolNavy} />
          <Text style={styles.backButtonText}>Back to My Schools</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    width: 280,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: colors.schoolNavy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  schoolName: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  menuList: {
    flex: 1,
    paddingTop: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderLeftWidth: 3,
    borderLeftColor: 'transparent',
  },
  menuItemActive: {
    backgroundColor: colors.schoolNavy,
    borderLeftColor: colors.schoolAccent,
  },
  menuLabel: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: colors.textSecondary,
  },
  menuLabelActive: {
    color: colors.white,
    fontWeight: '600',
  },
  lockIcon: {
    marginLeft: 8,
  },
  bottomSection: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  backButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: colors.schoolNavy,
  },
});

export default SchoolSidebar;
