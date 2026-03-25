import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { FormInput, PrimaryButton, FormError, ProfileImagePicker } from '../components/shared';
import { colors } from '../utils/colors';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../contexts';
import { registerSchool } from '../services/schoolService';

type RegisterSchoolScreenProps = NativeStackScreenProps<RootStackParamList, 'RegisterSchool'>;

const RegisterSchoolScreen: React.FC<RegisterSchoolScreenProps> = ({ navigation }) => {
  const { user } = useAuth();
  const currentUserId = user?.id;

  const [logo, setLogo] = useState<string | null>(null);
  const [schoolName, setSchoolName] = useState('');
  const [address, setAddress] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const handleBack = () => {
    navigation.goBack();
  };

  const handleImagePress = () => {
    Alert.alert(
      'School Logo',
      'Choose an option',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Take Photo', onPress: () => console.log('Take photo') },
        { text: 'Choose from Library', onPress: () => console.log('Choose from library') },
        ...(logo ? [{ text: 'Remove Photo', style: 'destructive' as const, onPress: () => setLogo(null) }] : []),
      ]
    );
  };

  const validateForm = (): boolean => {
    if (!schoolName.trim()) {
      setError('School name is required');
      return false;
    }
    if (!address.trim()) {
      setError('Address is required');
      return false;
    }
    // Validate email format if provided
    if (email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        setError('Please enter a valid email address');
        return false;
      }
    }
    // Validate phone number format if provided
    if (phoneNumber.trim()) {
      // Allow digits, spaces, parentheses, hyphens, and + sign
      const phoneRegex = /^[\d\s\-\(\)\+]+$/;
      if (!phoneRegex.test(phoneNumber.trim())) {
        setError('Please enter a valid phone number');
        return false;
      }
      // Check minimum length (at least 7 digits)
      const digitsOnly = phoneNumber.replace(/\D/g, '');
      if (digitsOnly.length < 7) {
        setError('Phone number must have at least 7 digits');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    setError(undefined);

    if (!validateForm()) {
      return;
    }

    if (!currentUserId) {
      setError('User not logged in');
      return;
    }

    setLoading(true);

    try {
      const result = await registerSchool(
        {
          name: schoolName,
          address: address,
          ownerName: ownerName || undefined,
          phoneNumber: phoneNumber || undefined,
          email: email || undefined,
          logo: logo,
        },
        currentUserId
      );

      if (result.success) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Register Your School</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo Picker */}
          <View style={styles.logoSection}>
            <ProfileImagePicker
              imageUri={logo}
              name={schoolName || 'School'}
              onPress={handleImagePress}
              size={96}
            />
            <Text style={styles.logoHint}>Upload School Logo</Text>
            <Text style={styles.logoSubHint}>PNG or JPG up to 2MB</Text>
          </View>

          {/* Form Fields */}
          <View style={styles.formSection}>
            <FormInput
              label="School Name"
              placeholder="e.g. Greenwood Academy"
              value={schoolName}
              onChangeText={setSchoolName}
              autoCapitalize="words"
              error={undefined}
            />

            <FormInput
              label="Address"
              placeholder="Street name, City, State, Zip"
              value={address}
              onChangeText={setAddress}
              multiline
              numberOfLines={3}
              containerStyle={styles.inputSpacing}
              textInputStyle={styles.textAreaStyle}
              error={undefined}
            />

            <FormInput
              label="Owner Name"
              placeholder="Full name of the administrator"
              value={ownerName}
              onChangeText={setOwnerName}
              autoCapitalize="words"
              containerStyle={styles.inputSpacing}
              error={undefined}
            />

            <FormInput
              label="Phone Number"
              placeholder="+1 (555) 000-0000"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              containerStyle={styles.inputSpacing}
              error={undefined}
            />

            <FormInput
              label="Email Address"
              placeholder="school@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              containerStyle={styles.inputSpacing}
              error={undefined}
            />

            <FormError message={error} />

            <View style={styles.buttonContainer}>
              <PrimaryButton
                title="Submit Registration"
                onPress={handleSubmit}
                loading={loading}
              />
            </View>

            <Text style={styles.termsText}>
              By clicking submit, you agree to our Terms of Service.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
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
  headerSpacer: {
    width: 40,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  logoSection: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  logoHint: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 12,
  },
  logoSubHint: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 4,
  },
  formSection: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  inputSpacing: {
    marginTop: 16,
  },
  textAreaStyle: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  buttonContainer: {
    marginTop: 32,
  },
  termsText: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 18,
  },
});

export default RegisterSchoolScreen;
