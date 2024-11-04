import React, { createRef } from 'react';
import {
  findNodeHandle,
  NativeModules,
  NativeSyntheticEvent,
  requireNativeComponent,
  StyleProp,
  UIManager,
  ViewStyle,
} from 'react-native';

const { CropViewManager } = NativeModules;
const RCTCropView = requireNativeComponent('CropView');

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
  aspectRatio?: { width: number; height: number };
  iosDimensionSwapEnabled?: boolean;
};

class CropView extends React.PureComponent<Props> {
  public static defaultProps = {
    keepAspectRatio: false,
    iosDimensionSwapEnabled: false,
  };

  private viewRef = createRef<any>();

  public saveImage = (preserveTransparency: boolean = true, quality: number = 90) => {
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(this.viewRef.current!),
      UIManager.getViewManagerConfig('CropView').Commands.saveImage,
      [preserveTransparency, quality]
    );
  };

  public rotateImage = (clockwise: boolean = true) => {
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(this.viewRef.current!),
      UIManager.getViewManagerConfig('CropView').Commands.rotateImage,
      [clockwise]
    );
  };

  public getCropCoordinates = (callback: (coordinates: CropCoordinates) => void) => {
    const reactTag = findNodeHandle(this.viewRef.current!);
    
    // Call the native module directly to get crop coordinates
    CropViewManager.getCropCoordinates(reactTag, (error: string, coordinates: CropCoordinates) => {
      if (error) {
        console.error("Error retrieving crop coordinates:", error);
        return;
      }
      callback(coordinates);
    });
  };

  public render() {
    const { onImageCrop, aspectRatio, ...rest } = this.props;

    return (
      <RCTCropView
        ref={this.viewRef}
        cropAspectRatio={aspectRatio}
        onImageSaved={(event: NativeSyntheticEvent<Response>) => {
          onImageCrop!(event.nativeEvent);
        }}
        {...rest}
      />
    );
  }
}

export default CropView;
