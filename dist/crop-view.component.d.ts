import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
type Response = {
    uri: string;
    width: number;
    height: number;
    x: number;
    y: number;
};
type CropCoordinates = {
    x: number;
    y: number;
    width: number;
    height: number;
};
type Props = {
    sourceUrl: string;
    style?: StyleProp<ViewStyle>;
    onImageCrop?: (res: Response) => void;
    keepAspectRatio?: boolean;
    aspectRatio?: {
        width: number;
        height: number;
    };
    iosDimensionSwapEnabled?: boolean;
};
declare class CropView extends React.PureComponent<Props> {
    static defaultProps: {
        keepAspectRatio: boolean;
        iosDimensionSwapEnabled: boolean;
    };
    private viewRef;
    saveImage: (preserveTransparency?: boolean, quality?: number) => void;
    rotateImage: (clockwise?: boolean) => void;
    getCropCoordinates: (callback: (coordinates: CropCoordinates) => void) => void;
    render(): JSX.Element;
}
export default CropView;
