
import {ImageProps} from 'react-native';

export interface OnboardingData {
  id: number;
  image: ImageProps;
  text: string;
  textColor: string;
  backgroundColor: string;
}

const data: OnboardingData[] = [
  {
    id: 1,
    image: require('../images/cl-1.png'),
    text: 'Not able to find the person to work for',
    textColor: '#f8dac2',
    backgroundColor: '#154f40',
  },
  {
    id: 2,
    image: require('../images/fr-1.png'),
    text: 'Wanting to go out to work to new places',
    textColor: '#154f40',
    backgroundColor: '#fd94b2',
  },
  {
    id: 3,
    image: require('../images/tech-1.png'),
    text: 'Not confident on digital technology',
    textColor: 'black',
    backgroundColor: '#f8dac2',
  },
];

export default data;
