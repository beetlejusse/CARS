import RideCard from "@/components/RideCard";
import { sampleData } from "@/lib/data";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { Link } from "expo-router";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "react-native";
import { icons, images } from "@/constants";

export default function Home() {
  const { user } = useUser();
  const loading = true;

  const handleSignOut = () => {};

  return (
    <SafeAreaView className="bg-general-500">
      <FlatList
        data={sampleData?.slice(0, 5)}
        // data={[]}
        renderItem={({ item }) => <RideCard ride={item} />}
        className="px-5"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingBottom: 100,
        }}
        ListEmptyComponent={() => (
          <View className="flex flex-col items-center justify-center">
            {!loading ? (
              <>
                <Image
                  source={images.noResult}
                  className="w-40 h-40"
                  alt="No Recent Rides Found"
                  resizeMode="contain"
                />
                <Text className="text-sm">No Recent Rides Found</Text>
              </>
            ) : (
              <ActivityIndicator size="small" color="#000" />
            )}
          </View>
        )}
        ListHeaderComponent={() => (
          <>
            <View className="flex flex-row items-center justify-between my-5">
              <Text className="text-2xl capitalize font-JakartaExtraBold">
                Welcome{", "}
                {user?.firstName ||
                  user?.emailAddresses[0].emailAddress.split("@")[0]}{" "}
              </Text>
              <TouchableOpacity
                onPress={handleSignOut}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white"
              >
                <Image source={icons.out} className="w-4 h-4" />
              </TouchableOpacity>
            </View>

            {/* Google text input */}
          </>
        )}
      />
    </SafeAreaView>
  );
}
