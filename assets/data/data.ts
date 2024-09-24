
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
    text: 'onboarding.find_person', // Translation key
    textColor: '#f8dac2',
    backgroundColor: '#154f40',
  },
  {
    id: 2,
    image: require('../images/fr-1.png'),
    text: 'onboarding.work_new_places', // Translation key
    textColor: '#154f40',
    backgroundColor: '#fd94b2',
  },
  {
    id: 3,
    image: require('../images/tech-1.png'),
    text: 'onboarding.digital_confidence', // Translation key
    textColor: 'black',
    backgroundColor: '#f8dac2',
  },
];

export default data;
