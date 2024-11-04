//
//  CropViewManager.m
//  react-native-image-crop-tools
//
//  Created by Hunaid Hassan on 31/12/2019.
//

#import "CropViewManager.h"
#import "RCTCropView.h"
#import <React/RCTUIManager.h>

@implementation CropViewManager

RCT_EXPORT_MODULE()

-(UIView *)view {
    return [[RCTCropView alloc] init];
}

RCT_EXPORT_VIEW_PROPERTY(sourceUrl, NSString)
RCT_EXPORT_VIEW_PROPERTY(onImageSaved, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(keepAspectRatio, BOOL)
RCT_EXPORT_VIEW_PROPERTY(cropAspectRatio, CGSize)
RCT_EXPORT_VIEW_PROPERTY(iosDimensionSwapEnabled, BOOL)


RCT_EXPORT_METHOD(saveImage:(nonnull NSNumber*) reactTag
                  preserveTransparency:(BOOL) preserveTransparency
                  quality:(nonnull NSNumber *) quality) {
    [self.bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *,UIView *> *viewRegistry) {
        RCTCropView *cropView = (RCTCropView *)viewRegistry[reactTag];
        CGRect cropFrame = [cropView getCropFrame];
        UIImage *image = [cropView getCroppedImage];

        NSString *extension = @"jpg";
        if ([[image valueForKey:@"hasAlpha"] boolValue] && preserveTransparency) {
            extension = @"png";
        }

        NSArray *paths = [[NSFileManager defaultManager] URLsForDirectory:NSCachesDirectory inDomains:NSUserDomainMask];
        NSURL *url = [[paths firstObject] URLByAppendingPathComponent:[NSString stringWithFormat:@"%@.%@", [[NSUUID UUID] UUIDString], extension]];

        if ([[image valueForKey:@"hasAlpha"] boolValue] && preserveTransparency) {
            [UIImagePNGRepresentation(image) writeToURL:url atomically:YES];
        }else {
            [UIImageJPEGRepresentation(image, [quality floatValue] / 100.0f) writeToURL:url atomically:YES];
        }

        cropView.onImageSaved(@{
            @"uri": url.absoluteString,
            @"width": [NSNumber numberWithDouble:cropFrame.size.width],
            @"height": [NSNumber numberWithDouble:cropFrame.size.height],
            @"x": [NSNumber numberWithDouble:cropFrame.origin.x],
            @"y": [NSNumber numberWithDouble:cropFrame.origin.y]
        });
    }];
}

RCT_EXPORT_METHOD(getCropCoordinates:(nonnull NSNumber*) reactTag
                  callback:(RCTResponseSenderBlock)callback) {
    [self.bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *,UIView *> *viewRegistry) {
        RCTCropView *cropView = (RCTCropView *)viewRegistry[reactTag];
        
        if (!cropView) {
            callback(@[@"Crop view not found", [NSNull null]]);
            return;
        }
        
        CGRect cropFrame = [cropView getCropFrame];
        
        // Create a dictionary to hold the crop coordinates
        NSDictionary *coordinates = @{
            @"x": @(cropFrame.origin.x),
            @"y": @(cropFrame.origin.y),
            @"width": @(cropFrame.size.width),
            @"height": @(cropFrame.size.height)
        };
        
        // Call the callback with nil for no error and the coordinates as the result
        callback(@[[NSNull null], coordinates]);
    }];
}

RCT_EXPORT_METHOD(rotateImage:(nonnull NSNumber*) reactTag clockwise:(BOOL) clockwise) {
    [self.bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *,UIView *> *viewRegistry) {
        RCTCropView *cropView = (RCTCropView *)viewRegistry[reactTag];
        [cropView rotateImage:clockwise];
    }];
}

@end
