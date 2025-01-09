import { View, Alert } from "react-native";
import { useEffect, useState } from "react";
import { api } from "@/api/api";

import { Categories, type CategoriesProps } from "@/components/categories";
import type { PlaceProps } from "@/components/place";
import { Places } from "@/components/places";

type MarketProps = PlaceProps;

export default function Home() {
	const [categories, setCategories] = useState<CategoriesProps>();
	const [category, setCategory] = useState("");
	const [markets, setMarkets] = useState<MarketProps[]>([]);

	async function fetchCategories() {
		try {
			const { data } = await api.get("/categories");
			setCategories(data);
			setCategory(data[0].id);
		} catch (error) {
			console.log(error);
			Alert.alert("Categorias", "Não foi possível carregar as categorias");
		}
	}

	async function fetchMarkets() {
		try {
			if (!category) return;

			const { data } = await api.get(`/markets/category/${category}`);
			setMarkets(data);
		} catch (error) {
			console.log(error);
			Alert.alert("Mercados", "Não foi possível carregar os mercados");
		}
	}

	useEffect(() => {
		fetchCategories();
	}, []);

	useEffect(() => {
		fetchMarkets();
	}, [category]);

	return (
		<View style={{ flex: 1, backgroundColor: "#CECECE" }}>
			<Categories
				data={categories}
				onSelect={setCategory}
				selected={category}
			/>
			<Places data={markets} />
		</View>
	);
}
