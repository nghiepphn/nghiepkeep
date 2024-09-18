import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, inject, Renderer2, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserInfo } from '@lib/interfaces';
import { AuthService } from '@lib/services';
import { storage } from '@lib/utils';
import { LogoComponent } from '../logo/logo.component';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [CommonModule, RouterModule, LogoComponent],
    templateUrl: './navbar.component.html',
    styleUrls: ['navbar.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
    @ViewChild('iconNofi')
    iconNofi!: ElementRef;
    @ViewChild('listNoti')
    listNoti!: ElementRef;

    @ViewChild('avatar')
    avatar!: ElementRef;
    @ViewChild('userInfo')
    userInfo!: ElementRef;

    constructor(private authService: AuthService, private renderer: Renderer2) {
        // this.renderer.listen('window', 'click', (e: Event) => {
        //     if (e.target !== this.iconNofi.nativeElement && e.target !== this.listNoti.nativeElement) {
        //         this.isShowNoti = false;
        //     }
        // });
        // this.renderer.listen('window', 'click', (e: Event) => {
        //     if (e.target !== this.avatar.nativeElement && e.target !== this.userInfo.nativeElement) {
        //         this.isShow = false;
        //     }
        // });
    }

    private readonly _router = inject(Router);
    private readonly _authService = inject(AuthService);

    onClickSignOut(): void {
        this._authService.logout();
        this._router.navigate(['/auth/login']);
    }
    showAvatar = 'material-icons-outlined hover avatar';
    avatarLink?: string = '';
    ngOnInit() {
        this.showAvatar = 'hover avatar';
        this.avatarLink = this.getUserInfo()?.avatarUrl;
    }

    isShow = false;

    isShowNoti = false;
    notifications = [
        {
            id: 1,
            avatarUrl: 'https://www.gravatar.com/avatar',
            content: 'Hình vuông màu đỏ đã căn giữa theo cả chiều ngang lẫn chiều dọc.',
            createdAt: new Date(),
        },
        {
            id: 1,
            avatarUrl: 'https://www.gravatar.com/avatar',
            content: 'Hình vuông màu đỏ đã căn giữa theo cả chiều ngang lẫn chiều dọc.',
            createdAt: new Date(),
        },
        {
            id: 1,
            avatarUrl: 'https://www.gravatar.com/avatar',
            content: 'Hình vuông màu đỏ đã căn giữa theo cả chiều ngang lẫn chiều dọc.',
            createdAt: new Date(),
        },
        {
            id: 1,
            avatarUrl: 'https://www.gravatar.com/avatar',
            content: 'Hình vuông màu đỏ đã căn giữa theo cả chiều ngang lẫn chiều dọc.',
            createdAt: new Date(),
        },
    ];

    showUserInfo() {
        this.isShow = !this.isShow;
    }

    userName = this.getUserInfo()?.username;

    getUserInfo(): UserInfo | undefined {
        const tokenInfo = storage.getItem('tokenInfo');
        return tokenInfo?.user;
    }

    fullName = this.getUserInfo()?.fullName;
    email = this.getUserInfo()?.email;

    closeUserInfo() {
        this.isShow = false;
    }

    logout() {
        this.authService.logout();
        this._router.navigate(['auth/login']);
    }

    showNoti() {
        this.isShowNoti = !this.isShowNoti;
    }
}
