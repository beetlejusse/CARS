import { Stack } from "expo-router";

export default function AuhLayout() {
  return (
      <Stack>
        <Stack.Screen name="welcomescreen" options={{ headerShown: false }} />
        <Stack.Screen name="sign-up" options={{ headerShown: false }} />
        <Stack.Screen name="sign-in" options={{ headerShown: false }} />
      </Stack>
  );
}
