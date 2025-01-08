import {
	TouchableOpacity,
	type TouchableOpacityProps,
	Text,
	type TextProps,
	ActivityIndicator,
} from "react-native";
import type { IconProps as TablerIconProps } from "@tabler/icons-react-native";

import { s } from "./style";
import { colors } from "@/styles/colors";

type ButtonProps = TouchableOpacityProps & {
	loading?: boolean;
};

function Button({ children, style, loading = false, ...rest }: ButtonProps) {
	return (
		<TouchableOpacity
			style={[s.container, style]}
			activeOpacity={0.8}
			disabled={loading}
			{...rest}
		>
			{loading ? (
				<ActivityIndicator size={"small"} color={colors.gray[100]} />
			) : (
				children
			)}
		</TouchableOpacity>
	);
}

function Title({ children }: TextProps) {
	return <Text style={s.title}>{children}</Text>;
}

type IconProps = {
	icon: React.ComponentType<TablerIconProps>;
};

function Icon({ icon: Icon }: IconProps) {
	return <Icon size={24} color={colors.gray[100]}/>;
}

Button.Title = Title;
Button.Icon = Icon;

export { Button };
