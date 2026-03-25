import React, { useState, ReactNode } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../utils/colors';
import SchoolSidebar, { SidebarMenuItem } from './SchoolSidebar';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface SchoolLayoutProps {
  children: ReactNode;
  schoolId: number;
  schoolName: string;
  menuItems: SidebarMenuItem[];
  activeItem?: string;
  onMenuItemPress: (item: SidebarMenuItem) => void;
  onBackToSchools: () => void;
  onProfilePress?: () => void;
}

const SchoolLayout: React.FC<SchoolLayoutProps> = ({
  children,
  schoolId,
  schoolName,
  menuItems,
  activeItem,
  onMenuItemPress,
  onBackToSchools,
  onProfilePress,
}) => {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const handleMenuItemPress = (item: SidebarMenuItem) => {
    setSidebarVisible(false);
    onMenuItemPress(item);
  };

  const handleBackToSchools = () => {
    setSidebarVisible(false);
    onBackToSchools();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Hamburger */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.hamburgerButton}
          onPress={() => setSidebarVisible(true)}
          activeOpacity={0.7}
        >
          <Ionicons name="menu" size={28} color={colors.schoolNavy} />
        </TouchableOpacity>
        <View style={styles.headerSpacer} />
        <TouchableOpacity
          style={styles.profileButton}
          onPress={onProfilePress}
          activeOpacity={0.7}
        >
          <Ionicons name="person-circle" size={28} color={colors.schoolNavy} />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.content}>{children}</View>

      {/* Sidebar Modal */}
      <Modal
        visible={sidebarVisible}
        transparent
        animationType="none"
        onRequestClose={() => {}}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.sidebarContainer}>
            <SchoolSidebar
              schoolName={schoolName}
              menuItems={menuItems}
              activeItem={activeItem}
              onItemPress={handleMenuItemPress}
              onBackToSchools={handleBackToSchools}
            />
          </View>
          <TouchableOpacity
            style={styles.backdrop}
            onPress={() => {}}
            activeOpacity={1}
          />
        </View>
      </Modal>
    </SafeAreaView>
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
  hamburgerButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSpacer: {
    flex: 1,
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
  modalOverlay: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sidebarContainer: {
    width: 280,
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 20,
  },
});

export default SchoolLayout;
