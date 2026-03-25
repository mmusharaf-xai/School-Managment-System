import React, { useState, useRef, useCallback, ReactNode } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
  SafeAreaView,
  Animated,
  PanResponder,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../utils/colors';
import SchoolSidebar, { SidebarMenuItem } from './SchoolSidebar';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SIDEBAR_WIDTH = 280;
const ANIMATION_DURATION = 300;

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
  const slideAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const isClosing = useRef(false);

  const animateOpen = useCallback(() => {
    setSidebarVisible(true);
    isClosing.current = false;
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0.5,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
    ]).start();
  }, [slideAnim, backdropOpacity]);

  const animateClose = useCallback(
    (onComplete?: () => void) => {
      if (isClosing.current) return;
      isClosing.current = true;

      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -SIDEBAR_WIDTH,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setSidebarVisible(false);
        isClosing.current = false;
        if (onComplete) onComplete();
      });
    },
    [slideAnim, backdropOpacity]
  );

  const handleOpenSidebar = () => {
    animateOpen();
  };

  const handleCloseSidebar = () => {
    animateClose();
  };

  const handleMenuItemPress = (item: SidebarMenuItem) => {
    animateClose(() => {
      onMenuItemPress(item);
    });
  };

  const handleBackToSchools = () => {
    animateClose(() => {
      onBackToSchools();
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only capture for left swipe (to close sidebar)
        return gestureState.dx < -20 && Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
      },
      onMoveShouldSetPanResponderCapture: (_, gestureState) => {
        // Capture for left swipe
        return gestureState.dx < -20 && Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
      },
      onPanResponderMove: (_, gestureState) => {
        // Only allow left swipe (negative dx) to move sidebar
        if (gestureState.dx < 0) {
          slideAnim.setValue(gestureState.dx);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        // If swiped left more than 50px, close the sidebar
        if (gestureState.dx < -50) {
          animateClose();
        } else {
          // Otherwise, snap back open
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Hamburger */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.hamburgerButton}
          onPress={handleOpenSidebar}
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
        onRequestClose={handleCloseSidebar}
      >
        <View style={styles.modalOverlay} {...panResponder.panHandlers}>
          {/* Animated Sidebar */}
          <Animated.View
            style={[
              styles.sidebarContainer,
              {
                transform: [{ translateX: slideAnim }],
              },
            ]}
          >
            <SchoolSidebar
              schoolName={schoolName}
              menuItems={menuItems}
              activeItem={activeItem}
              onItemPress={handleMenuItemPress}
              onBackToSchools={handleBackToSchools}
            />
          </Animated.View>

          {/* Animated Backdrop */}
          <TouchableOpacity
            style={styles.backdrop}
            onPress={handleCloseSidebar}
            activeOpacity={1}
          >
            <Animated.View
              style={[
                styles.backdropOverlay,
                { opacity: backdropOpacity },
              ]}
            />
          </TouchableOpacity>
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
    backgroundColor: 'transparent',
  },
  backdropOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sidebarContainer: {
    width: SIDEBAR_WIDTH,
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 20,
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  },
});

export default SchoolLayout;
