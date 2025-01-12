import { Alert, Modal, ScrollView, StatusBar, View } from "react-native";
import { Redirect, router, useLocalSearchParams } from "expo-router";
import { useCameraPermissions, CameraView } from "expo-camera";

import { api } from "@/api/api";
import { useEffect, useRef, useState } from "react";
import { Loading } from "@/components/loading";
import { Cover } from "@/components/market/cover";
import { Coupon } from "@/components/market/coupon";
import { Button } from "@/components/button";

import { type PropsDetails, Details } from "@/components/market/details";

type DataProps = PropsDetails & {
	cover: string;
};

export default function Market() {
	const [data, setData] = useState<DataProps>();
	const [coupon, setCoupon] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [couponLoading, setCouponLoading] = useState(false);
	const [isVisibleCameraModal, setIsVisibleCameraModal] = useState(false);

	const [hasPermission, requestPermission] = useCameraPermissions();
	const params = useLocalSearchParams<{ id: string }>();
	console.log(params.id);

	const qrLock = useRef(false);

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

	async function handleOpenCamera() {
		try {
			const { granted } = await requestPermission();

			if (!granted) {
				Alert.alert("Câmera", "Você precisa permitir o acesso a câmera");
				return;
			}

			qrLock.current = false;
			setIsVisibleCameraModal(true);
		} catch (error) {
			console.log(error);
			Alert.alert("Câmera", "Não foi possível abrir a câmera");
		}
	}

	async function getCoupon(id: string) {
		try {
			setCouponLoading(true);

			const { data } = await api.patch(`/coupons/${id}`);

			Alert.alert("Cupom", data.coupon);
			setCoupon(data.coupon);
		} catch (error) {
			console.log(error);
			Alert.alert("Cupom", "Não foi possível resgatar o cupom");
		} finally {
			setCouponLoading(false);
		}
	}

	function handleUseCoupon(id: string) {
		setIsVisibleCameraModal(false);

		Alert.alert("Cupom", "Deseja resgatar o cupom?", [
			{ style: "cancel", text: "Não" },
			{ text: "Sim", onPress: () => getCoupon(id) },
		]);
	}

	useEffect(() => {
		fetchMarket();
	}, [params.id, coupon]);

	if (isLoading) {
		return <Loading />;
	}

	if (!data) {
		return <Redirect href="/home" />;
	}

	return (
		<View style={{ flex: 1 }}>
			<StatusBar barStyle="light-content" hidden={isVisibleCameraModal} />

			<ScrollView showsVerticalScrollIndicator={false}>
				<Cover uri={data.cover} />
				<Details data={data} />
				{coupon && <Coupon code={coupon} />}
			</ScrollView>

			<View style={{ padding: 32 }}>
				<Button onPress={handleOpenCamera}>
					<Button.Title>Ler QR Code</Button.Title>
				</Button>
			</View>

			<Modal
				visible={isVisibleCameraModal}
				animationType="slide"
				style={{ flex: 1 }}
			>
				<CameraView
					style={{ flex: 1 }}
					facing="back"
					onBarcodeScanned={({ data }) => {
						if (data && !qrLock.current) {
							qrLock.current = true;
							setTimeout(() => handleUseCoupon(data), 500);
						}
					}}
				/>

				<View style={{ position: "absolute", bottom: 32, left: 32, right: 32 }}>
					<Button
						onPress={() => setIsVisibleCameraModal(false)}
						loading={couponLoading}
					>
						<Button.Title>Fechar</Button.Title>
					</Button>
				</View>
			</Modal>
		</View>
	);
}
