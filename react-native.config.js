
module.exports = {
    project: {
        ios: {},
        android: {},
    },
    "react-native-verctor-icons": {
        platforms:{
            ios: null,
        }
    },
    asserts: ["./src/assets/fonts/",'./node_modules/react-native-vector-icons/Fonts'],
    getTransformModulePath(){
        return require.resolve("react-native-typescript-transformer");
    },
    getSourceExts(){
        return ["ts", "tsx"];
    }
}