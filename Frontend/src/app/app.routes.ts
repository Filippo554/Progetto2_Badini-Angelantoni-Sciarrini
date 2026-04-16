import { Routes } from '@angular/router';
import { Login } from './features/login/login'
import { Book } from './features/bookings/book/book';
import { Detail } from './features/bookings/detail/detail';
import { Search } from './features/bookings/search/search';
import { Calendar } from './features/bookings/views/calendar/calendar';
import { Daily } from './features/bookings/views/daily/daily';
import { Weekly } from './features/bookings/views/weekly/weekly';
import { Error } from './features/error/error';
import { Home } from './features/home/home';

export const routes: Routes = [
    { path: '',         redirectTo: 'home', pathMatch: 'full' },
    { path: 'calendar', component: Calendar                   },
    { path: 'daily',    component: Daily                      },
    { path: 'weekly',   component: Weekly                     },
    { path: 'home',     component: Home                       },
    { path: 'login',    component: Login                      },
    { path: 'search',   component: Search                     },
    { path: 'detail',   component: Detail                     },
    { path: 'book',     component: Book                     },
    { path: 'error',    component: Error                      },
    {
        path: '**',
        redirectTo: '/error?code=404&message=Not%20found'
    },
];
