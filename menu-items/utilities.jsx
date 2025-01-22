// assets
import {
  AppstoreAddOutlined,
  AntDesignOutlined,
  BarcodeOutlined,
  BgColorsOutlined,
  FontSizeOutlined,
  LoadingOutlined
} from '@ant-design/icons';

// icons
const icons = {
  FontSizeOutlined,
  BgColorsOutlined,
  BarcodeOutlined,
  AntDesignOutlined,
  LoadingOutlined,
  AppstoreAddOutlined
};

// ==============================|| MENU ITEMS - UTILITIES ||============================== //

const utilities = {
  id: 'utilities',
  title: 'Utilities',
  type: 'group',
  children: [
    {
      id: 'util-typography',
      title: 'Category Section',
      type: 'item',
      // url: '/typography',
      url: '/category',
      // icon: icons.FontSizeOutlined
    },
    {
      id: 'util-color',
      title: 'Book Section',
      type: 'item',
      // url: '/color',
      url: '/book',

      // icon: icons.BgColorsOutlined
    },
    {
      id: 'util-shadow',
      title: 'Author Section',
      type: 'item',
      // url: '/shadow',
      url: '/author',

      // icon: icons.BarcodeOutlined
    },
    // {
    //   id: 'util-typography',
    //   title: 'typography Section',
    //   type: 'item',
    //   url: '/typography',
    //   // url: '/category',
    //   icon: icons.FontSizeOutlined
    // },
    // {
    //   id: 'util-color',
    //   title: 'color Section',
    //   type: 'item',
    //   url: '/color',
    //   // url: '/book',

    //   icon: icons.BgColorsOutlined
    // },
    // {
    //   id: 'util-shadow',
    //   title: 'shadow Section',
    //   type: 'item',
    //   url: '/shadow',
    //   // url: '/author',

    //   icon: icons.BarcodeOutlined
    // },
    
    {
      id: 'logout',
      title: 'Logout',
      type: 'item',
      url: '/logout',
    
    }
  ]
};

export default utilities;
