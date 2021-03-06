import { ImagePicker, Permissions } from 'expo';
import React, { Component } from 'react';
import { Linking, TouchableOpacity, View } from 'react-native';

import Settings from '../constants/Settings';
import Avatar from './Avatar';
import EditPhotoButton from './Button/EditPhoto';

export default class ProfileImage extends React.Component {
  _getPermission = async permission => {
    let { status } = await Permissions.askAsync(permission);
    if (status !== 'granted') {
      Linking.openURL('app-settings:');
      return false;
    }
    return true;
  };

  _takePhoto = async () => {
    const permission = await this._getPermission(Permissions.CAMERA);
    if (!permission) {
      return;
    }
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.cancelled) {
      this._setNewPhoto(result.uri);
    }
  };

  _setNewPhoto = async uri => {
    alert('TODO: Evan: Add photo upload', uri);
  };

  _selectPhoto = async () => {
    const permission = await this._getPermission(Permissions.CAMERA_ROLL);
    if (!permission) {
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.cancelled) {
      this._setNewPhoto(result.uri);
    }
  };

  _viewProfilePicture = () => {
    //TODO: Evan: Lightbox
  };

  onPress = async () => {
    if (!Settings.canEditPhoto) {
      return;
    }
    if (!this.props.isUser) {
      this._viewProfilePicture();
      return;
    }
    // Same interface as https://facebook.github.io/react-native/docs/actionsheetios.html
    const sheetOptions = [
      {
        name: 'View Profile Picture',
        action: this._viewProfilePicture,
      },
      {
        name: 'Take New Photo',
        action: this._takePhoto,
      },
      {
        name: 'Select New Photo',
        action: this._selectPhoto,
      },
      { name: 'Cancel' },
    ];
    let destructiveButtonIndex = 0;
    let cancelButtonIndex = sheetOptions.length - 1;

    this.props.showActionSheetWithOptions(
      {
        options: sheetOptions.map(({ name }) => name),
        cancelButtonIndex,
      },
      buttonIndex => {
        if (buttonIndex !== cancelButtonIndex) {
          const { action } = sheetOptions[buttonIndex];
          console.log(buttonIndex, sheetOptions[buttonIndex]);
          if (action) {
            action(buttonIndex);
          }
        }
        // Do something here depending on the button index selected
      },
    );
  };

  render() {
    const { image, isUser, name } = this.props;
    const avatarSize = 128;

    return (
      <View
        style={{
          marginRight: 16,
          height: avatarSize,
          minWidth: avatarSize,
        }}
      >
        <TouchableOpacity onPress={this.onPress}>
          <Avatar
            textStyle={{ fontWeight: 'bold', fontSize: 48 }}
            avatarStyle={{
              width: '100%',
              height: '100%',
              borderRadius: avatarSize / 2,
            }}
            name={name}
            avatar={image}
          />
          {isUser &&
            Settings.canEditPhoto && (
              <EditPhotoButton
                style={{ position: 'absolute', bottom: 0, right: 0 }}
              />
            )}
        </TouchableOpacity>
      </View>
    );
  }
}
