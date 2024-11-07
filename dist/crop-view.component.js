import React, { createRef } from 'react';
import { findNodeHandle, NativeModules, requireNativeComponent, UIManager, } from 'react-native';
const { CropViewManager } = NativeModules;
const RCTCropView = requireNativeComponent('CropView');
class CropView extends React.PureComponent {
    static defaultProps = {
        keepAspectRatio: false,
        iosDimensionSwapEnabled: false,
    };
    viewRef = createRef();
    saveImage = (preserveTransparency = true, quality = 90) => {
        UIManager.dispatchViewManagerCommand(findNodeHandle(this.viewRef.current), UIManager.getViewManagerConfig('CropView').Commands.saveImage, [preserveTransparency, quality]);
    };
    rotateImage = (clockwise = true) => {
        UIManager.dispatchViewManagerCommand(findNodeHandle(this.viewRef.current), UIManager.getViewManagerConfig('CropView').Commands.rotateImage, [clockwise]);
    };
    getCropCoordinates = (callback) => {
        const reactTag = findNodeHandle(this.viewRef.current);
        // Call the native module directly to get crop coordinates
        CropViewManager.getCropCoordinates(reactTag, (error, coordinates) => {
            if (error) {
                console.error("Error retrieving crop coordinates:", error);
                return;
            }
            callback(coordinates);
        });
    };
    render() {
        const { onImageCrop, aspectRatio, ...rest } = this.props;
        return (React.createElement(RCTCropView, { ref: this.viewRef, cropAspectRatio: aspectRatio, onImageSaved: (event) => {
                onImageCrop(event.nativeEvent);
            }, ...rest }));
    }
}
export default CropView;
