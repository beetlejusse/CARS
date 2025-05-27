import { Alert, Image, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { ScrollView } from "react-native";
import { images } from "@/constants";
import InputField from "@/components/InputField";
import { icons } from "@/constants";
import CustomButton from "@/components/CustomButton";
import OAuthComponent from "@/components/OAuthComponent";
import { useSignUp } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import ReactNativeModal from "react-native-modal";

const SignUp = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  const [verification, setVerification] = useState({
    state: "default",
    error: "",
    code: "",
  });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const onSignUpPress = async () => {
    if (!isLoaded) return;

    try {
      await signUp.create({
        emailAddress: formData.email,
        password: formData.password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setVerification({
        ...verification,
        state: "pending",
      });
    } catch (err: any) {
      Alert.alert(
        "Error",
        err.errors[0].longMessage || "An error occurred while signing up."
      );
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded) return;

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code: verification.code,
      });
      if (signUpAttempt.status === "complete") {
        //create a database user

        await setActive({ session: signUpAttempt.createdSessionId });
        setVerification({
          ...verification,
          state: "Success",
        });
        router.replace("/");
      } else {
        setVerification({
          ...verification,
          error: "Verificatio failed",
          state: "failed",
        });
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err: any) {
      setVerification({
        ...verification,
        error: err.errors[0].longMessage,
        state: "failed",
      });
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <View className="relative w-full h-[250px]">
          <Image source={images.signUpCar} className="z-0 w-full h-[250px]" />
          <Text className="text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5">
            Create Your Account
          </Text>
        </View>
        <View className="p-5">
          <InputField
            label="Name"
            placeholder="Enter your name"
            icon={icons.person}
            value={formData.name}
            onChangeText={(value) => setFormData({ ...formData, name: value })}
          />

          <InputField
            label="Email"
            placeholder="email@domain.com"
            icon={icons.email}
            value={formData.email}
            onChangeText={(value) => setFormData({ ...formData, email: value })}
          />

          <InputField
            label="Password"
            placeholder="Enter your password"
            icon={icons.lock}
            secureTextEntry={true}
            value={formData.password}
            onChangeText={(value) =>
              setFormData({ ...formData, password: value })
            }
          />

          <CustomButton
            title="Sign Up"
            className="mt-6 shadow-lg shadow-black"
            onPress={onSignUpPress}
          />

          <OAuthComponent />

          <Link
            href="/sign-in"
            className="text-lg text-center text-general-200 mt-10"
          >
            <Text>Already have an account? </Text>
            <Text className="text-primary-500">Log In</Text>
          </Link>
        </View>

        {/* verification model */}

        <ReactNativeModal
          isVisible={verification.state === "pending"}
          onModalHide={() => {
            // setVerification({ ...verification, state: "pending" })
            if (verification.state === "success") setShowSuccessModal(true);
          }}
        >
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <Text className="text-2xl font-JakartaExtraBold mb-2">
              Verification
            </Text>
            <Text className="font-jakarta mb-5">
              We've sent a verification code to {formData.email}. Please enter
              the code below to verify your account.
            </Text>

            <InputField
              label="Code"
              icon={icons.lock}
              placeholder="Enter verification code"
              value={verification.code}
              keyboardType="numeric"
              onChangeText={(value) =>
                setVerification({ ...verification, code: value })
              }
            />

            {verification.error ? (
              <Text className="text-red-500 text-sm mt-2">
                {verification.error}
              </Text>
            ) : null}

            <CustomButton
              title="Verify Account"
              className="mt-5 bg-success-500"
              onPress={onVerifyPress}
            />
          </View>
        </ReactNativeModal>

        <ReactNativeModal isVisible={showSuccessModal}>
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <Image
              source={images.check}
              className="w-[110px] h-[110px] mx-auto my-5"
            />

            <Text className="text-3xl font-JakartaBold text-center">
              Verified
            </Text>
            <Text className="text-base text-gray-400 font-Jakarta text-center mt-2">
              You have successfully verified your Account
            </Text>

            <CustomButton
              title="Browse Home"
              onPress={() =>{
                router.push('/(root)/(tabs)/home')
                setShowSuccessModal(false)
              }}
              className="mt-5"
            />
          </View>
        </ReactNativeModal>
      </View>
    </ScrollView>
  );
};

export default SignUp;
