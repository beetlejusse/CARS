import { Alert, Image, Text, View } from "react-native";
import React, { useCallback, useState } from "react";
import { ScrollView } from "react-native";
import { images } from "@/constants";
import InputField from "@/components/InputField";
import { icons } from "@/constants";
import CustomButton from "@/components/CustomButton";
import { Link, router } from "expo-router";
import OAuthComponent from "@/components/OAuthComponent";
import { useSignIn } from "@clerk/clerk-expo";

const SignIn = () => {
  const { signIn, setActive, isLoaded } = useSignIn();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  
  const onSignInPress = useCallback(async () => {
    if (!isLoaded) return;

    try {
      const signInAttempt = await signIn.create({
        identifier: formData.email,
        password: formData.password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/(root)/(tabs)/home");
      } else {
        console.log(JSON.stringify(signInAttempt, null, 2));
        Alert.alert("Error", "Log in failed. Please try again.");
      }
    } catch (err: any) {
      console.log(JSON.stringify(err, null, 2));
      Alert.alert("Error", err.errors[0].longMessage);
    }
  }, [isLoaded, formData, signIn, setActive, router]);

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <View className="relative w-full h-[250px]">
          <Image source={images.signUpCar} className="z-0 w-full h-[250px]" />
          <Text className="text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5">
            Welcome!!!
          </Text>
        </View>
        <View className="p-5">
          <InputField
            label="Email"
            placeholder="email@domain.com"
            icon={icons.email}
            textContentType="emailAddress"
            value={formData.email}
            onChangeText={(value) => setFormData({ ...formData, email: value })}
          />

          <InputField
            label="Password"
            placeholder="Enter your password"
            icon={icons.lock}
            secureTextEntry={true}
            textContentType="password"
            value={formData.password}
            onChangeText={(value) =>
              setFormData({ ...formData, password: value })
            }
          />

          <CustomButton
            title="Sign In"
            className="mt-6 shadow-lg shadow-black"
            onPress={onSignInPress}
          />

          <OAuthComponent />

          <Link
            href="/sign-up"
            className="text-lg text-center text-general-200 mt-10"
          >
            <Text>Don't have an account? </Text>
            <Text className="text-primary-500">Sign Up</Text>
          </Link>
        </View>

        {/* verification model */}
      </View>
    </ScrollView>
  );
};

export default SignIn;
