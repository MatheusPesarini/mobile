import { Alert, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import { api } from "@/api/api";
import { useEffect, useState } from "react";
import { Loading } from "@/components/loading";

export default function Market() {
	const [data, setData] = useState<any>({});
	const [isLoading, setIsLoading] = useState(true);

	const params = useLocalSearchParams<{ id: string }>();

	async function fetchMarket() {
		try {
			const { data } = await api.get(`/markets/${params.id}`);
			setData(data);
      setIsLoading(false);
			// console.log(data);
		} catch (error) {
			console.log(error);
			Alert.alert("Mercado", "Não foi possível carregar o mercado", [
				{ text: "OK", onPress: () => router.back() },
			]);
		}
	}

	useEffect(() => {
		fetchMarket();
	}, [params.id]);

	if (isLoading) {
		return <Loading />;
	}

	return (
		<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
			<Text>{params.id}</Text>
		</View>
	);
}
