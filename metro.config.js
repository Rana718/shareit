const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { withNativeWind } = require('nativewind/metro');


const defaultConfig = getDefaultConfig(__dirname);
const { assetExts, sourceExts } = defaultConfig.resolver;

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const customeConfig = {
    transformer: {
        babelTransformerPath: require.resolve('react-native-svg-transformer'),
    },
    resolver: {
        assetExts: [...assetExts.filter((ext) => ext !== 'svg'), 'pem', 'p12'],
        sourceExts: [...sourceExts, 'svg'],
    },
};

const config = mergeConfig(defaultConfig, customeConfig);


module.exports = withNativeWind(config, { input: './global.css' });