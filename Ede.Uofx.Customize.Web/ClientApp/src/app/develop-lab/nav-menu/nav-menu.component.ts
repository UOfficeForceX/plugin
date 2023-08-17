import { Component, Inject, ViewChild } from '@angular/core';
import { ClickEventArgs, MenuEventArgs, MenuItemModel, SidebarComponent } from '@syncfusion/ej2-angular-navigations';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss']
})
export class NavMenuComponent {
  isExpanded = false;

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }


  @ViewChild('sidebarMenuInstance')
  public sidebarMenuInstance: SidebarComponent;
  public menuItems: MenuItemModel[] = [
    {
      text: 'Hello Plugin',
      iconCss: 'e-timeline-week e-icons',
      items: [
        { text: 'Design', url: 'hello-world/design' },
        { text: 'Props', url: 'hello-world/props' },
        { text: 'Write', url: 'hello-world/write' },
        { separator: true },
        { text: 'App' },
      ]
    },
    {
      text: 'Advamced Plugin',
      iconCss: 'e-timeline-week e-icons',
      items: [
        { text: 'Design', url: 'advanced-field/design' },
        { text: 'Props', url: 'advanced-field/props' },
        { text: 'Write', url: 'advanced-field/write' },
        { separator: true },
        { text: 'App' },
      ]
    },
  ];
  public enableDock: boolean = true;
  public dockSize: string = '50px';
  public width: string = '220px';
  public target: string = '.main-menu-content';

  constructor() {

  }

  toolbarCliked(args: ClickEventArgs) {
    if (args.item.tooltipText == "Menu") {
      this.sidebarMenuInstance.toggle();
    }
  }

  onMenuItemSelect(ev: MenuEventArgs) {
    console.log(ev.item);
  }
}
