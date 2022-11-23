import * as React from 'react';
import Portal from './portal';
import DefaultLayout from '../src/components/DefaultLayout';

export default function Index() {
  return (
    <DefaultLayout title="ComuDEV - Início">
      <Portal />
    </DefaultLayout>
  );
}
