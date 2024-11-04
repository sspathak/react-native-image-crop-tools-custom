require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "react-native-image-crop-tools-custom"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.description  = <<-DESC
                  react-native-image-crop-tools-custom
                   DESC
  s.homepage     = "https://github.com/sspathak/react-native-image-crop-tools-custom"
  s.license      = "MIT"
  s.authors      = { "Hunaid Hassan" => "hhunaid@gmail.com" }
  s.platforms    = { :ios => "9.0" }
  s.source       = { :git => "https://github.com/sspathak/react-native-image-crop-tools-custom.git", :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,m}"
  s.requires_arc = true

  s.dependency "React-Core"
  s.dependency 'TOCropViewController', '2.5.3'
end

