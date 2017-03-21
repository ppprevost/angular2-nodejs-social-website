webpackJsonp([1,5],{

/***/ 194:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ToastComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var ToastComponent = (function () {
    function ToastComponent() {
        this.message = { body: '', type: '' };
    }
    ToastComponent.prototype.setMessage = function (body, type, time) {
        var _this = this;
        if (time === void 0) { time = 3000; }
        this.message.body = body;
        this.message.type = type;
        setTimeout(function () { _this.message.body = ''; }, time);
    };
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["y" /* Input */])(), 
        __metadata('design:type', Object)
    ], ToastComponent.prototype, "message", void 0);
    ToastComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["V" /* Component */])({
            selector: 'app-toast',
            template: __webpack_require__(543),
            styles: [__webpack_require__(529)]
        }), 
        __metadata('design:paramtypes', [])
    ], ToastComponent);
    return ToastComponent;
}());
//# sourceMappingURL=toast.component.js.map

/***/ }),

/***/ 308:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__services_data_service__ = __webpack_require__(85);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__shared_toast_toast_component__ = __webpack_require__(194);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_forms__ = __webpack_require__(119);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_router__ = __webpack_require__(82);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var AppComponent = (function () {
    function AppComponent(data, toast, addUserForm, router) {
        this.data = data;
        this.toast = toast;
        this.addUserForm = addUserForm;
        this.router = router;
        this.email = new __WEBPACK_IMPORTED_MODULE_3__angular_forms__["c" /* FormControl */]('', __WEBPACK_IMPORTED_MODULE_3__angular_forms__["d" /* Validators */].required);
        this.password = new __WEBPACK_IMPORTED_MODULE_3__angular_forms__["c" /* FormControl */]('', __WEBPACK_IMPORTED_MODULE_3__angular_forms__["d" /* Validators */].required);
    }
    AppComponent.prototype.ngOnInit = function () {
        this.loginUser = this.addUserForm.group({
            email: this.email,
            password: this.password
        });
    };
    AppComponent.prototype.loginAccount = function () {
        console.log(this.loginUser);
        this.data.loginAccount(this.loginUser.value).subscribe(function (data) {
            console.log(data);
            localStorage.setItem("profile", data["_body"]);
        });
        this.toast.setMessage('item added successfully.', 'success');
    };
    AppComponent.prototype.logOut = function () {
        var _this = this;
        console.log("click sur logout avec socket");
        try {
            this.userId = JSON.parse(localStorage["profile"])._id;
            this.data.logOut({ userId: this.userId }).subscribe(function (res) {
                console.log(res);
                localStorage.clear();
                _this.router.navigate(['./']);
            });
        }
        catch (err) {
        }
    };
    AppComponent.prototype.loggedIn = function () {
        return localStorage["profile"];
    };
    AppComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["V" /* Component */])({
            selector: 'app-root',
            template: __webpack_require__(540),
            styles: [__webpack_require__(526)]
        }),
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["d" /* Injectable */])(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__services_data_service__["a" /* DataService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__services_data_service__["a" /* DataService */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__shared_toast_toast_component__["a" /* ToastComponent */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_2__shared_toast_toast_component__["a" /* ToastComponent */]) === 'function' && _b) || Object, (typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_3__angular_forms__["e" /* FormBuilder */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_3__angular_forms__["e" /* FormBuilder */]) === 'function' && _c) || Object, (typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_4__angular_router__["c" /* Router */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_4__angular_router__["c" /* Router */]) === 'function' && _d) || Object])
    ], AppComponent);
    return AppComponent;
    var _a, _b, _c, _d;
}());
//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 340:
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = 340;


/***/ }),

/***/ 341:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__ = __webpack_require__(432);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_module__ = __webpack_require__(462);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__environments_environment__ = __webpack_require__(469);




if (__WEBPACK_IMPORTED_MODULE_3__environments_environment__["a" /* environment */].production) {
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["a" /* enableProdMode */])();
}
__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_2__app_app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 462:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(131);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(119);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_http__ = __webpack_require__(127);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_router__ = __webpack_require__(82);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__app_component__ = __webpack_require__(308);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__services_data_service__ = __webpack_require__(85);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__shared_toast_toast_component__ = __webpack_require__(194);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__profile_profile_component__ = __webpack_require__(464);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__sidebar_sidebar_component__ = __webpack_require__(466);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__signup_signup_component__ = __webpack_require__(467);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__valid_url_valid_url_component__ = __webpack_require__(468);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__services_guard_service__ = __webpack_require__(465);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__follow_user_follow_user_component__ = __webpack_require__(463);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};














var routing = __WEBPACK_IMPORTED_MODULE_4__angular_router__["a" /* RouterModule */].forRoot([
    { path: '', component: __WEBPACK_IMPORTED_MODULE_5__app_component__["a" /* AppComponent */] },
    { path: 'profil', component: __WEBPACK_IMPORTED_MODULE_8__profile_profile_component__["a" /* ProfileComponent */], canActivate: [__WEBPACK_IMPORTED_MODULE_12__services_guard_service__["a" /* AuthGuard */]] },
    { path: 'signup', component: __WEBPACK_IMPORTED_MODULE_10__signup_signup_component__["a" /* SignupComponent */] },
    {
        path: 'email-verification', children: [{
                path: ':URL',
                component: __WEBPACK_IMPORTED_MODULE_11__valid_url_valid_url_component__["a" /* ValidUrlComponent */]
            }]
    },
    { path: 'app-follow-user', component: __WEBPACK_IMPORTED_MODULE_13__follow_user_follow_user_component__["a" /* FollowUserComponent */], canActivate: [__WEBPACK_IMPORTED_MODULE_12__services_guard_service__["a" /* AuthGuard */]] }
]);
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_core__["b" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_5__app_component__["a" /* AppComponent */],
                __WEBPACK_IMPORTED_MODULE_7__shared_toast_toast_component__["a" /* ToastComponent */],
                __WEBPACK_IMPORTED_MODULE_8__profile_profile_component__["a" /* ProfileComponent */],
                __WEBPACK_IMPORTED_MODULE_9__sidebar_sidebar_component__["a" /* SidebarComponent */],
                __WEBPACK_IMPORTED_MODULE_10__signup_signup_component__["a" /* SignupComponent */],
                __WEBPACK_IMPORTED_MODULE_11__valid_url_valid_url_component__["a" /* ValidUrlComponent */],
                __WEBPACK_IMPORTED_MODULE_13__follow_user_follow_user_component__["a" /* FollowUserComponent */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_2__angular_forms__["a" /* FormsModule */],
                __WEBPACK_IMPORTED_MODULE_2__angular_forms__["b" /* ReactiveFormsModule */],
                __WEBPACK_IMPORTED_MODULE_3__angular_http__["a" /* HttpModule */],
                routing
            ],
            providers: [
                __WEBPACK_IMPORTED_MODULE_6__services_data_service__["a" /* DataService */],
                __WEBPACK_IMPORTED_MODULE_12__services_guard_service__["a" /* AuthGuard */],
                __WEBPACK_IMPORTED_MODULE_7__shared_toast_toast_component__["a" /* ToastComponent */]
            ],
            schemas: [__WEBPACK_IMPORTED_MODULE_1__angular_core__["c" /* CUSTOM_ELEMENTS_SCHEMA */]],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_5__app_component__["a" /* AppComponent */]]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 463:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__services_data_service__ = __webpack_require__(85);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FollowUserComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var FollowUserComponent = (function () {
    function FollowUserComponent(data) {
        this.data = data;
        this.user = JSON.parse(localStorage.getItem('profile'));
    }
    FollowUserComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.data.getUsers().then(function (data) {
            console.log(data);
            _this.waster = JSON.parse(data._body);
        });
    };
    FollowUserComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["V" /* Component */])({
            selector: 'app-follow-user',
            template: __webpack_require__(541),
            styles: [__webpack_require__(527)]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__services_data_service__["a" /* DataService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__services_data_service__["a" /* DataService */]) === 'function' && _a) || Object])
    ], FollowUserComponent);
    return FollowUserComponent;
    var _a;
}());
//# sourceMappingURL=follow-user.component.js.map

/***/ }),

/***/ 464:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__services_data_service__ = __webpack_require__(85);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(119);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ProfileComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var ProfileComponent = (function () {
    function ProfileComponent(data, passwordForm) {
        this.data = data;
        this.passwordForm = passwordForm;
        this.password = new __WEBPACK_IMPORTED_MODULE_2__angular_forms__["c" /* FormControl */]('', __WEBPACK_IMPORTED_MODULE_2__angular_forms__["d" /* Validators */].required);
        this.confirm = new __WEBPACK_IMPORTED_MODULE_2__angular_forms__["c" /* FormControl */]('', __WEBPACK_IMPORTED_MODULE_2__angular_forms__["d" /* Validators */].required);
    }
    ProfileComponent.prototype.ngOnInit = function () {
        this.profile = localStorage["profile"];
        if (this.profile) {
            this.user = JSON.parse(this.profile);
        }
        this.updatePass = this.passwordForm.group({
            password: this.password,
            confirm: this.confirm
        });
    };
    ProfileComponent.prototype.updateChamp = function (event) {
        console.log(event.target.value);
        var obj = {};
        obj["userId"] = this.user["_id"];
        obj[event.target.name] = event.target.value;
        this.data.updateChamp(obj).subscribe(function (res) {
            console.log(res);
            localStorage.setItem("profile", res._body);
        });
    };
    ProfileComponent.prototype.updatePassword = function () {
        if (this.updatePass.value.confirm == this.updatePass.value.password) {
            this.updatePass.value["userId"] = this.user["_id"];
            this.data.updatePassword(this.updatePass.value).subscribe(function (res) { return console.log(res); });
        }
        else {
            console.log("ceci ne correspond pas !!");
        } //
    };
    ProfileComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["V" /* Component */])({
            selector: 'app-profile',
            template: __webpack_require__(542),
            styles: [__webpack_require__(528)]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__services_data_service__["a" /* DataService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__services_data_service__["a" /* DataService */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__angular_forms__["e" /* FormBuilder */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_2__angular_forms__["e" /* FormBuilder */]) === 'function' && _b) || Object])
    ], ProfileComponent);
    return ProfileComponent;
    var _a, _b;
}());
//# sourceMappingURL=profile.component.js.map

/***/ }),

/***/ 465:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__(82);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AuthGuard; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var AuthGuard = (function () {
    function AuthGuard(router) {
        this.router = router;
    }
    AuthGuard.prototype.canActivate = function () {
        // If user is not logged in we'll send them to the homepage
        if (!localStorage["profile"]) {
            this.router.navigate(['']);
            return false;
        }
        return true;
    };
    AuthGuard = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["d" /* Injectable */])(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["c" /* Router */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_router__["c" /* Router */]) === 'function' && _a) || Object])
    ], AuthGuard);
    return AuthGuard;
    var _a;
}());
//# sourceMappingURL=guard.service.js.map

/***/ }),

/***/ 466:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_component__ = __webpack_require__(308);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SidebarComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var SidebarComponent = (function () {
    function SidebarComponent(appComponent) {
        this.appComponent = appComponent;
    }
    SidebarComponent.prototype.ngOnInit = function () {
    };
    SidebarComponent.prototype.logOut = function () {
        return this.appComponent.logOut();
    };
    SidebarComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["V" /* Component */])({
            selector: 'app-sidebar',
            template: __webpack_require__(544),
            styles: [__webpack_require__(525)]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__app_component__["a" /* AppComponent */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__app_component__["a" /* AppComponent */]) === 'function' && _a) || Object])
    ], SidebarComponent);
    return SidebarComponent;
    var _a;
}());
//# sourceMappingURL=sidebar.component.js.map

/***/ }),

/***/ 467:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(127);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_data_service__ = __webpack_require__(85);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_forms__ = __webpack_require__(119);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__shared_toast_toast_component__ = __webpack_require__(194);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_router__ = __webpack_require__(82);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_add_operator_map__ = __webpack_require__(322);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_rxjs_add_operator_map__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SignupComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var SignupComponent = (function () {
    function SignupComponent(http, dataService, addUserForm, toast, router) {
        this.http = http;
        this.dataService = dataService;
        this.addUserForm = addUserForm;
        this.toast = toast;
        this.router = router;
        this.email = new __WEBPACK_IMPORTED_MODULE_3__angular_forms__["c" /* FormControl */]('', __WEBPACK_IMPORTED_MODULE_3__angular_forms__["d" /* Validators */].required);
        this.username = new __WEBPACK_IMPORTED_MODULE_3__angular_forms__["c" /* FormControl */]('', __WEBPACK_IMPORTED_MODULE_3__angular_forms__["d" /* Validators */].required);
        this.password = new __WEBPACK_IMPORTED_MODULE_3__angular_forms__["c" /* FormControl */]('', __WEBPACK_IMPORTED_MODULE_3__angular_forms__["d" /* Validators */].required);
    }
    SignupComponent.prototype.ngOnInit = function () {
        console.log('Vous etes connecte sur la pgae de profil');
        this.addUser = this.addUserForm.group({
            email: this.email,
            username: this.username,
            pass: this.password
        });
    };
    SignupComponent.prototype.addAccount = function () {
        var _this = this;
        this.dataService.createAccount(this.addUser.value).subscribe(function (res) {
            _this.res = res;
            console.log("response Angular2", res);
            _this.toast.setMessage('item added successfully.', 'success');
            _this.router.navigate(['./']);
        });
    };
    SignupComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["V" /* Component */])({
            selector: 'app-signup',
            template: __webpack_require__(545),
            styles: [__webpack_require__(530)]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_http__["d" /* Http */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_http__["d" /* Http */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__services_data_service__["a" /* DataService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_2__services_data_service__["a" /* DataService */]) === 'function' && _b) || Object, (typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_3__angular_forms__["e" /* FormBuilder */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_3__angular_forms__["e" /* FormBuilder */]) === 'function' && _c) || Object, (typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_4__shared_toast_toast_component__["a" /* ToastComponent */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_4__shared_toast_toast_component__["a" /* ToastComponent */]) === 'function' && _d) || Object, (typeof (_e = typeof __WEBPACK_IMPORTED_MODULE_5__angular_router__["c" /* Router */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_5__angular_router__["c" /* Router */]) === 'function' && _e) || Object])
    ], SignupComponent);
    return SignupComponent;
    var _a, _b, _c, _d, _e;
}());
//# sourceMappingURL=signup.component.js.map

/***/ }),

/***/ 468:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(127);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_router__ = __webpack_require__(82);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ValidUrlComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var ValidUrlComponent = (function () {
    function ValidUrlComponent(http, activatedRoute) {
        this.http = http;
        this.activatedRoute = activatedRoute;
        this.headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */]({ 'Content-Type': 'application/json', 'charset': 'UTF-8' });
        this.options = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* RequestOptions */]({ headers: this.headers });
    }
    ValidUrlComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.activatedRoute.params.subscribe(function (params) {
            _this.url = params['URL'];
        });
        this.http.post('/verif', JSON.stringify({ url: this.url }), this.options).subscribe(function (res) {
            _this.welcome = "bravo, vous pouvez maintenant vous connecter !! ";
            console.log(res);
        });
    };
    ValidUrlComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["V" /* Component */])({
            selector: 'app-valid-url',
            template: __webpack_require__(546),
            styles: [__webpack_require__(531)]
        }),
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["d" /* Injectable */])(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_http__["d" /* Http */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_http__["d" /* Http */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__angular_router__["b" /* ActivatedRoute */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_2__angular_router__["b" /* ActivatedRoute */]) === 'function' && _b) || Object])
    ], ValidUrlComponent);
    return ValidUrlComponent;
    var _a, _b;
}());
//# sourceMappingURL=valid-url.component.js.map

/***/ }),

/***/ 469:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return environment; });
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
var environment = {
    production: false
};
//# sourceMappingURL=environment.js.map

/***/ }),

/***/ 525:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(18)();
// imports


// module
exports.push([module.i, ".sidebar.sidebar-skin-dark .sidebar-block {\n  border-color: #2e2e2e; }\n\n.sidebar-main {\n  width: 250px;\n  position: absolute;\n  top: 71px;\n  right: 0; }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 526:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(18)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 527:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(18)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 528:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(18)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 529:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(18)();
// imports


// module
exports.push([module.i, ".alert {\r\n\tz-index: 999;\r\n\tposition: fixed;\r\n\tbottom: 15px;\r\n\tleft: 25%;\r\n\twidth: 50%;\r\n\topacity: 0.9;\r\n}", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 530:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(18)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 531:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(18)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 540:
/***/ (function(module, exports) {

module.exports = "<!--<div class=\"container\">-->\r\n\r\n<!--<nav class=\"navbar navbar-dark bg-primary\">-->\r\n<!--<div class=\"nav navbar-nav\">-->\r\n<!--<a routerLink=\"/\" class=\"nav-item nav-link\" routerLinkActive=\"active\" [routerLinkActiveOptions]=\"{exact:true}\">-->\r\n<!--<i class=\"fa fa-home\"></i> Home-->\r\n<!--</a>-->\r\n<!--<a routerLink=\"/about\" class=\"nav-item nav-link\" routerLinkActive=\"active\">-->\r\n<!--<i class=\"fa fa-info-circle\"></i> About-->\r\n<!--</a>-->\r\n<!--</div>-->\r\n<!--</nav>-->\r\n\r\n<!--<router-outlet></router-outlet>-->\r\n\r\n<!--</div>-->\r\n\r\n<header>\r\n  <nav class=\"principal-navbar navbar navbar-default navbar-fixed-top principal-header\">\r\n    <div class=\"container\">\r\n      <div class=\"navbar-header\">\r\n        <button data-toggle=\"collapse\" data-target=\"#navbar\" class=\"navbar-toggle collapsed\">\r\n          <span class=\"sr-only\">Toggle navigation</span>\r\n          <span class=\"icon-bar\"></span>\r\n          <span class=\"icon-bar\"></span>\r\n          <span class=\"icon-bar\"></span>\r\n        </button>\r\n        <a href=\"/\" class=\"navbar-brand\">Mon Social</a>\r\n        <a *ngIf=\"loggedIn()\" class=\"navbar-brand\">Mon Profil</a>\r\n      </div>\r\n      <div id=\"navbar\" class=\"navbar-collapse\">\r\n\r\n        <div class=\"nav navbar-nav navbar-right\">\r\n          <div class=\"form-inline\">\r\n            <form *ngIf=\"!loggedIn()\" action=\"\" [formGroup]=\"loginUser\">\r\n              <input type=\"text\" placeholder=\"votre email\" formControlName=\"email\"> <input type=\"password\"\r\n                                                                                           formControlName=\"password\"\r\n                                                                                           placeholder=\"votre mot de password\">\r\n              <button (click)=\"loginAccount()\">Login</button>\r\n            </form>\r\n            <a *ngIf=\"!loggedIn()\" routerLink=\"/signup\" routerLinkActive=\"active\">Create An Account</a>\r\n          </div>\r\n        </div>\r\n        <ul *ngIf=\"loggedIn()\" class=\"nav navbar-nav navbar-right\">\r\n          <li class=\"dropdown\">\r\n            <a data-toggle=\"dropdown\" class=\"navbar-avatar dropdown-toggle\"> Menu<i class=\"caret\"></i>\r\n            </a>\r\n            <ul class=\"dropdown-menu\">\r\n              <li><a routerLink='/profil' routerLinkActive=\"active\">Edit Profile</a></li>\r\n              <li class=\"divider\"></li>\r\n              <li><a routerLink='/app-follow-user' routerLinkActive=\"active\">Follow Users</a></li>\r\n              <li class=\"divider\"></li>\r\n\r\n              <li><a (click)=\"logOut()\">Logout</a></li>\r\n            </ul>\r\n          </li>\r\n        </ul>\r\n      </div>\r\n    </div>\r\n  </nav>\r\n</header>\r\n\r\n<!-- Contenu  -->\r\n<article>\r\n  <div class=\"container primaryContent\">\r\n    <router-outlet></router-outlet>\r\n    <app-sidebar>CONTETN</app-sidebar>\r\n  </div>\r\n</article>\r\n"

/***/ }),

/***/ 541:
/***/ (function(module, exports) {

module.exports = "<div class=\"row userProfile\" data-toggle=\"isotope\" style=\"position: relative; height: 768px; \">\n  <div class=\"col-md-6 col-lg-4 item\" *ngFor=\"let waste of waster\"\n       [hidden]=\"user._id == waste._id\">\n    <div class=\"panel panel-default\">\n      <div class=\"panel-heading\">\n        <div class=\"media\">\n          <div class=\"pull-left\" ng-click=\"click()\">\n            <!--<img ng-src=\"{{waster.image}}\" alt=\"people\" class=\"media-object img-circle\" style=\"width:150px;height: 150px;\">-->\n          </div>\n          <div class=\"media-body\">\n            <h4 class=\"media-heading margin-v-5\"><a href=\"#\">{{waste.username}}</a></h4>\n            <span>{{waste.email}}</span>\n            <div class=\"profile-icons\">\n              <span><i class=\"fa fa-users\"></i> none</span>\n              <span><i class=\"fa fa-photo\"></i> none</span>\n            </div>\n            <!--<h3 ng-if=\"waster.isConnected\" class=\"blink_me\">Online</h3>-->\n          </div>\n        </div>\n      </div>\n      <div class=\"panel-body\">\n        <p class=\"common-friends\">Common Friends</p>\n        <div class=\"user-friend-list\">\n          <!--<a href=\"#\" ng-repeat=\"images in image\">-->\n          <!--<img ng-src=\"{{images.image}}\" alt=\"people\" class=\"img-circle\" style=\"width:50px; height:50px\">-->\n          <!--</a>-->\n        </div>\n      </div>\n      <!--<div class=\"panel-footer\">-->\n      <!--<a class=\"btn btn-default btn-sm\" ng-click=\"follow(user._id, waster._id)\"-->\n      <!--ng-if=\"!checkIsFollowing(waster._id)\">Follow <i class=\"fa fa-share\"></i></a>-->\n      <!--<a class=\"btn btn-default btn-sm\" ng-if=\"checkIsFollowing(waster._id) =='pending'\">Vous avez demandé<i-->\n      <!--class=\"fa fa-share\"></i></a>-->\n      <!--<a class=\"btn btn-default btn-sm\" ng-if=\"checkIsFollowing(waster._id) =='requested'\"-->\n      <!--ng-click=\"followOk(user._id, waster._id)\">Accepté la demande d'ajout<i class=\"fa fa-share\"></i></a>-->\n      <!--<a class=\"btn btn-danger btn-sm\" ng-click=\"unfollow(user._id, waster._id)\"-->\n      <!--ng-if=\"checkIsFollowing(waster._id) == 'accepted'\">Unfollow <i class=\"fa fa-low-vision\"></i></a>-->\n      <!--</div>-->\n    </div>\n  </div>\n</div>\n"

/***/ }),

/***/ 542:
/***/ (function(module, exports) {

module.exports = "<div class=\"col-sm-8 col-sm-offset-2\">\r\n  <h2>Bienvenue {{user.username}}</h2>\r\n</div>\r\n\r\n<div class=\"container\">\r\n  <div class=\"panel\">\r\n    <div class=\"panel-body\">\r\n      <form ng-submit=\"updateProfile()\" class=\"form-horizontal\" enctype=\"multipart/form-data\">\r\n        <legend>Profile Information</legend>\r\n        <div class=\"form-group\">\r\n          <label for=\"email\" class=\"col-sm-3\">Email</label>\r\n          <div class=\"col-sm-7\">\r\n            <input type=\"text\" name=\"email\" class=\"form-control\" [(ngModel)]=\"user.email\" (blur)=\"updateChamp($event)\">\r\n          </div>\r\n        </div>\r\n        <div class=\"form-group\">\r\n          <label for=\"name\" class=\"col-sm-3\">Name</label>\r\n          <div class=\"col-sm-7\">\r\n            <input type=\"text\" name=\"username\" class=\"form-control\" [(ngModel)]=\"user.username\"\r\n                   (blur)=\"updateChamp($event)\">\r\n          </div>\r\n        </div>\r\n        <div class=\"form-group\">\r\n          <label class=\"col-sm-3\">Gender</label>\r\n          <div class=\"col-sm-4\">\r\n            <label class=\"radio-inline radio col-sm-4\">\r\n              <input name=\"gender\" (change)=\"updateChamp($event)\" type=\"radio\" [(ngModel)]=\"user.gender\" name=\"gender\"\r\n                     value=\"male\" checked><span>Male</span>\r\n            </label>\r\n            <label class=\"radio-inline col-sm-4\">\r\n              <input name=\"gender\" (change)=\"updateChamp($event)\" type=\"radio\" [(ngModel)]=\"user.gender\" name=\"gender\"\r\n                     value=\"female\"><span>Female</span>\r\n            </label>\r\n          </div>\r\n        </div>\r\n        <div class=\"form-group\">\r\n          <label for=\"location\" class=\"col-sm-3\">Location</label>\r\n          <div class=\"col-sm-7\">\r\n            <input type=\"text\" name=\"location\" id=\"location\" class=\"form-control\" [(ngModel)]=\"user.location\"\r\n                   (blur)=\"updateChamp($event)\">\r\n          </div>\r\n        </div>\r\n        <div class=\"form-group\">\r\n          <label for=\"website\" class=\"col-sm-3\">Website</label>\r\n          <div class=\"col-sm-7\">\r\n            <input id=\"website\" type=\"text\" (blur)=\"updateChamp($event)\" name=\"website\" id=\"website\"\r\n                   class=\"form-control\" [(ngModel)]=\"user.website\">\r\n          </div>\r\n        </div>\r\n        <!--<div class=\"form-group\">-->\r\n          <!--<label class=\"col-sm-3\">Gravatar</label>-->\r\n          <!--<div class=\"col-sm-4\">-->\r\n            <!--<img ngf-thumbnail=\"file || 'app/images/default-avatar.jpg'\" class=\"profile\" width=\"100\"-->\r\n                 <!--height=\"100\">-->\r\n\r\n          <!--</div>-->\r\n          <!--<div class=\"row\"><input type=\"file\" class=\"button\"-->\r\n                                  <!--accept=\"image/*\">-->\r\n            <!--<i ng-show=\"file.$error.required\">*required</i><br>-->\r\n            <!--<i ng-show=\"file.$error.maxSize\">File too large-->\r\n              <!--MB: max 20M</i>-->\r\n\r\n          <!--</div>-->\r\n        <!--</div>-->\r\n        <!--<div class=\"form-group\">-->\r\n          <!--<label class=\"col-sm-3\">Cover</label>-->\r\n          <!--<div class=\"col-sm-4\">-->\r\n            <!--<img ngf-thumbnail=\"cover || 'app/images/default-avatar.jpg'\" class=\"profile\" width=\"300\"-->\r\n                 <!--height=\"100\">-->\r\n\r\n          <!--</div>-->\r\n          <!--<div class=\"row\"><input type=\"file\" class=\"button\" ngf-select=\"uploadCover($cover)\" [(ngModel)]=\"cover\"-->\r\n                                  <!--name=\"cover\" ngf-pattern=\"'image/*'\"-->\r\n                                  <!--accept=\"image/*\">-->\r\n            <!--<i ng-show=\"file.$error.required\">*required</i><br>-->\r\n            <!--<i ng-show=\"file.$error.maxSize\">File too large-->\r\n              <!--MB: max 20M</i>-->\r\n\r\n          <!--</div>-->\r\n        <!--</div>-->\r\n        <div class=\"form-group\">\r\n          <label class=\"col-sm-3\">Biographie</label>\r\n          <textarea class=\"form-control\" name=\"bio\" [(ngModel)]=\"user.bio\" (blur)=\"updateChamp($event)\"></textarea>\r\n        </div>\r\n        <div class=\"form-group\">\r\n          <div class=\"col-sm-offset-3 col-sm-4\">\r\n          </div>\r\n        </div>\r\n      </form>\r\n    </div>\r\n  </div>\r\n  <div class=\"panel\">\r\n    <div class=\"panel-body\">\r\n      <form (ngSubmit)=\"updatePassword()\" [formGroup]=\"updatePass\" class=\"form-horizontal\">\r\n        <legend>Change Password</legend>\r\n        <div class=\"form-group\">\r\n          <label for=\"password\" class=\"col-sm-3\">New Password</label>\r\n          <div class=\"col-sm-7\">\r\n            <input formControlName=\"password\" type=\"password\" name=\"password\" id=\"password\" class=\"form-control\"\r\n            >\r\n          </div>\r\n        </div>\r\n        <div class=\"form-group\">\r\n          <label for=\"confirm\" class=\"col-sm-3\">Confirm Password</label>\r\n          <div class=\"col-sm-7\">\r\n            <input formControlName=\"confirm\" type=\"password\" name=\"confirm\" id=\"confirm\" class=\"form-control\"\r\n            >\r\n          </div>\r\n        </div>\r\n        <div class=\"form-group\">\r\n          <div class=\"col-sm-4 col-sm-offset-3\">\r\n            <button type=\"submit\" class=\"btn btn-success\">Change Password</button>\r\n          </div>\r\n        </div>\r\n      </form>\r\n    </div>\r\n  </div>\r\n  <div class=\"panel\">\r\n    <div class=\"panel-body\">\r\n      <form ng-submit=\"deleteAccount()\" class=\"form-horizontal\">\r\n        <legend>Delete Account</legend>\r\n        <div class=\"form-group\">\r\n          <p class=\"col-sm-offset-3 col-sm-9\">You can delete your account, but keep in mind this action is\r\n            irreversible.</p>\r\n          <div class=\"col-sm-offset-3 col-sm-9\">\r\n            <button type=\"submit\" class=\"btn btn-danger\">Delete my account</button>\r\n          </div>\r\n        </div>\r\n      </form>\r\n    </div>\r\n  </div>\r\n</div>\r\n"

/***/ }),

/***/ 543:
/***/ (function(module, exports) {

module.exports = "<div *ngIf=\"message.body\" class=\"alert alert-{{message.type}} alert-dismissible\" role=\"alert\">\r\n  <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">\r\n    <span aria-hidden=\"true\">&times;</span>\r\n  </button>\r\n  <strong>Message:</strong> {{message.body}}\r\n</div>"

/***/ }),

/***/ 544:
/***/ (function(module, exports) {

module.exports = "<div *ngIf=\"appComponent.loggedIn()\" class=\"sidebar-block\">\r\n  <ul class=\"sidebar-feed sidebar-main\">\r\n    <li class=\"media\">\r\n      <div class=\"media-left\">\r\n                <span class=\"media-object\">\r\n                            <i class=\"fa fa-fw fa-bell\"></i>\r\n                        </span>\r\n      </div>\r\n      <div class=\"media-body\">\r\n        <a href=\"\" class=\"text-white\">Adrian</a> just logged in\r\n        <span class=\"time\">2 min ago</span>\r\n      </div>\r\n      <div class=\"media-right\">\r\n        <span class=\"news-item-success\"><i class=\"fa fa-circle\"></i></span>\r\n      </div>\r\n    </li>\r\n    <li class=\"media\">\r\n\r\n      <div class=\"media-left\">\r\n                <span class=\"media-object\">\r\n                            <i class=\"fa fa-fw fa-bell\"></i>\r\n                        </span>\r\n      </div>\r\n      <div class=\"media-body\">\r\n        <a href=\"\" class=\"text-white\">Adrian</a> just added <a href=\"\" class=\"text-white\">mosaicpro</a> as their office\r\n        <span class=\"time\">2 min ago</span>\r\n      </div>\r\n      <div class=\"media-right\">\r\n        <span class=\"news-item-success\"><i class=\"fa fa-circle\"></i></span>\r\n      </div>\r\n    </li>\r\n    <li class=\"media\">\r\n      <div class=\"media-left\">\r\n                <span class=\"media-object\">\r\n                            <i class=\"fa fa-fw fa-bell\"></i>\r\n                        </span>\r\n      </div>\r\n      <div class=\"media-body\">\r\n        <a href=\"\" class=\"text-white\">Adrian</a> just logged in\r\n        <span class=\"time\">2 min ago</span>\r\n      </div>\r\n    </li>\r\n    <li class=\"media\">\r\n      <div class=\"media-left\">\r\n                <span class=\"media-object\">\r\n                            <i class=\"fa fa-fw fa-bell\"></i>\r\n                        </span>\r\n      </div>\r\n      <div class=\"media-body\">\r\n        <a href=\"\" class=\"text-white\">Adrian</a> just logged in\r\n        <span class=\"time\">2 min ago</span>\r\n      </div>\r\n    </li>\r\n    <li class=\"media\">\r\n      <div class=\"media-left\">\r\n                <span class=\"media-object\">\r\n                            <i class=\"fa fa-fw fa-bell\"></i>\r\n                        </span>\r\n      </div>\r\n      <div class=\"media-body\">\r\n        <a href=\"\" class=\"text-white\">Adrian</a> just logged in\r\n        <span class=\"time\">2 min ago</span>\r\n      </div>\r\n    </li>\r\n  </ul>\r\n</div>\r\n"

/***/ }),

/***/ 545:
/***/ (function(module, exports) {

module.exports = "<div class=\"row\">\r\n  <form (ngSubmit)=\"addAccount()\" [formGroup]=\"addUser\" class=\"col-sm-6 col-sm-offset-3 newUserSignIn\">\r\n    <div class=\"form-group\">\r\n      <label>Name: </label>\r\n      <input formControlName=\"username\" type=\"text\" class=\"form-control\">\r\n    </div>\r\n\r\n    <div class=\"form-group\">\r\n      <label>Password:</label>\r\n      <input type=\"password\" formControlName=\"pass\" placeholder=\"votre mot de passe\" class=\"form-control\"\r\n             required=\"required\">\r\n    </div>\r\n    <div class=\"form-group\">\r\n      <label for=\"email\">Mail:</label>\r\n      <input type=\"email\" formControlName=\"email\" placeholder=\"votre mail\" id=\"email\" class=\"form-control\"\r\n             required=\"required\">\r\n    </div>\r\n    <button class=\"btn btn-default\">Submit</button>\r\n    <app-toast></app-toast>\r\n  </form>\r\n</div>\r\n"

/***/ }),

/***/ 546:
/***/ (function(module, exports) {

module.exports = "<div class=\"row\">\r\n\r\n  <h1>Vous etes sur la page d'auth</h1>\r\n  <p></p>\r\n\r\n  <h1>{{welcome}}</h1>\r\n\r\n</div>\r\n"

/***/ }),

/***/ 571:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(341);


/***/ }),

/***/ 85:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(127);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__ = __webpack_require__(322);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_toPromise__ = __webpack_require__(550);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_toPromise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_toPromise__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DataService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var DataService = (function () {
    function DataService(http, zone) {
        this.http = http;
        this.url = 'http://localhost:3000';
        this.headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */]({ 'Content-Type': 'application/json', 'charset': 'UTF-8' });
        this.options = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* RequestOptions */]({ headers: this.headers });
    }
    DataService.prototype.editCat = function (cat) {
        return this.http.put("/cat/" + cat._id, JSON.stringify(cat), this.options);
    };
    DataService.prototype.getUsers = function () {
        return this.http.get('api/users/get').toPromise();
    };
    DataService.prototype.createAccount = function (user) {
        return this.http.post('/api/user/signup', JSON.stringify(user), this.options);
    };
    DataService.prototype.updateChamp = function (champ) {
        return this.http.post('/api/profile/updateChamp', JSON.stringify(champ), this.options);
    };
    DataService.prototype.updatePassword = function (pass) {
        return this.http.post('/api/profile/updatePassword', JSON.stringify(pass), this.options);
    };
    DataService.prototype.loginAccount = function (user) {
        return this.http.post('/api/user/login', JSON.stringify(user), this.options);
    };
    DataService.prototype.logOut = function (userId) {
        return this.http.post('/api/user/logout', JSON.stringify(userId), this.options);
    };
    DataService = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["d" /* Injectable */])(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_http__["d" /* Http */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_http__["d" /* Http */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["e" /* NgZone */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_0__angular_core__["e" /* NgZone */]) === 'function' && _b) || Object])
    ], DataService);
    return DataService;
    var _a, _b;
}());
//# sourceMappingURL=data.service.js.map

/***/ })

},[571]);
//# sourceMappingURL=main.bundle.js.map