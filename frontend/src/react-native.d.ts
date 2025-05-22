declare module 'react-native' {
  import * as React from 'react';
  
  export interface ViewProps {
    style?: React.CSSProperties;
    children?: React.ReactNode;
  }
  
  export interface TextProps {
    style?: React.CSSProperties;
    children?: React.ReactNode;
  }
  
  export interface TouchableOpacityProps {
    style?: React.CSSProperties;
    children?: React.ReactNode;
    onPress?: () => void;
  }
  
  export const View: React.FC<ViewProps>;
  export const Text: React.FC<TextProps>;
  export const TouchableOpacity: React.FC<TouchableOpacityProps>;
  export const StyleSheet: {
    create: (styles: Record<string, any>) => Record<string, any>;
  };
}

declare module 'react-native-ar' {
  import * as React from 'react';
  
  export interface ARViewProps {
    style?: React.CSSProperties;
    children?: React.ReactNode;
  }
  
  export const ARView: React.FC<ARViewProps>;
}
