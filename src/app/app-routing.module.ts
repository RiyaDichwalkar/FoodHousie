import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

// import { NgModule } from '@angular/core';
// import { RouterModule, Routes } from '@angular/router';

// import { CustomersComponent } from './customers/customers.component';
// import { CustomersGridComponent } from './customers/customers-grid.component';
// import { CustomerEditComponent } from './customers/customer-edit.component';
// import { CustomerEditReactiveComponent } from './customers/customer-edit-reactive.component';
// import { IRouting } from './shared/interfaces';

// const routes: Routes = [
//   { path: '', pathMatch: 'full', redirectTo: '/customers' },
//   { path: 'customers', component: CustomersComponent},
//   { path: 'customers/:id', component: CustomerEditComponent},
//   //{ path: 'customers/:id', component: CustomerEditReactiveComponent },
//   { path: '**', redirectTo: '/customers' } //catch any unfound routes and redirect to home page
// ];

// @NgModule({
//   imports: [ RouterModule.forRoot(routes) ],
//   exports: [ RouterModule ]
// })
// export class AppRoutingModule {
//   static components = [ CustomersComponent, CustomerEditComponent, CustomerEditReactiveComponent, CustomersGridComponent ];
// }