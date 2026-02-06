import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import {AdminComponent} from "./admin/admin";
import { ConsumoComponent } from './consumo/consumo';


export const routes: Routes = [
  {
    title: 'Consumo',
    path: 'consumo',
    pathMatch: 'full',
    component: ConsumoComponent,

  },
  {
    title: 'Admin',
    path: 'admin',
    pathMatch: 'full',
    component: AdminComponent,
  }
];
