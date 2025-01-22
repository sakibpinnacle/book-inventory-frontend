// assets
import { LoginOutlined, ProfileOutlined } from '@ant-design/icons';

// icons
const icons = {
  LoginOutlined,
  ProfileOutlined
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //
const token = localStorage.getItem("token");
const pages = {
  id: 'authentication',
  title: 'Authentication',
  type: 'group',
  children: [
    {
      id: 'login',
      title: token?'logout':'login',
      type: 'item',
      url: token?'/login':'/login',
      icon: icons.LoginOutlined,
      target: true
    },

    !token?{
      id: 'register',
      title: 'Register1',
      type: 'item',
      url: '/register',
      icon: icons.ProfileOutlined,
      target: true
    }:''
    
  ]
};

export default pages;
