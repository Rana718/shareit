
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
    asserts: ["./src/assets/fonts/"],
    getTransformModulePath(){
        return require.resolve("react-native-typescript-transformer");
    },
    getSourceExts(){
        return ["ts", "tsx"];
    }
}