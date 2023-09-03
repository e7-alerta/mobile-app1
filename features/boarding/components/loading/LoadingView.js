import {Text, ActivityIndicator, TouchableOpacity, View} from 'react-native';
import HeaderBar from "../../../discover/components/discover/header/HeaderBar";
import Colors from "../../shared/colors";

export default function Loading({reload, setReload}) {


    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
            <HeaderBar/>
            <ActivityIndicator size="large" color={Colors.PRIMARY} />
            <TouchableOpacity className={"rounded-xl bg-blue-500 border-b-2 border-l-2 px-4 py-2 my-4"} onPress={() => {
                setReload(!reload);
            }}>
                <Text className={"font-semibold"} style={{ color: "white" }}>Reintentar</Text>
            </TouchableOpacity>
            <Text style={{ textAlign: 'center', color: 'gray', fontSize: 12, marginTop: 8 }}>
                Si la carga está tomando tiempo ⏳, ¡intente recargar aquí! 🔄
            </Text>
        </View>
    );
}
