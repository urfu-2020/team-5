import React from 'react';

import './contact-list.css';

import { NavigationHeader } from './NavigationHeader/NavigationHeader';
import { ContactList } from './ContactList/ContactList';

export const Navigation = () => (
  <>
    <NavigationHeader />
    <ContactList />
  </>
);