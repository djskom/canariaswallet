import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import RegistroScreen from './RegistroScreen';
import AccountCreate from './screen/AccountCreate';
import StakingScreen from './screen/StakingScreen';
import BuyScreen from './screen/BuyScreen';
import { useNavigation } from '@react-navigation/native';
import wallet from './screen/wallet';
import WalletGenerationScreen from './screen/WalletGenerationScreen';

const Tab = createBottomTabNavigator();

const Navigation = () => {
  const [walletCreated, setWalletCreated] = useState(false);
  const navigation = useNavigation();

  const handleWalletCreated = () => {
    setWalletCreated(true);
  };

  useEffect(() => {
    if (walletCreated) {
      navigation.navigate('AccountDetail');
    }
  }, [walletCreated, navigation]);

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Login"
        component={RegistroScreen}
        options={{ tabBarLabel: 'Account', headerShown: false }}
      />
      <Tab.Screen
        name="AccountCreate"
        component={AccountCreate}
        options={({ route, navigation }) => ({
          tabBarLabel: 'AccountCreate',
          headerShown: false,
          headerRight: () => (
            <HeaderRightButton
              onPress={() => navigation.setOptions({ handleWalletCreated })}
            />
          ),
        })}
      />
      <Tab.Screen
        name="WalletGenerationScreen"
        component={WalletGenerationScreen}
        options={{ tabBarLabel: 'WalletGenerationScreen', headerShown: false }}
      />
      <Tab.Screen
        name="Buy"
        component={BuyScreen}
        options={{ tabBarLabel: 'Buy', headerShown: false }}
      />
      <Tab.Screen
        name="Wallet"
        component={wallet}
        options={{ tabBarLabel: 'Wallet', headerShown: false }}
      />
    </Tab.Navigator>
  );
};

export default Navigation;
