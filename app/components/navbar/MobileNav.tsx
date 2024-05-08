import React from "react";
import {
  Drawer,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemPrefix,
} from "@material-tailwind/react";
import { XMarkIcon, RectangleGroupIcon } from "@heroicons/react/24/outline";
import { PowerIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import useAuth from "@hooks/useAuth";
import { MenuItems } from "@app/types";
import SignOutButton from "../SignOutButton";

interface Props {
  open: boolean;
  onClose(): void;
  menuItems: MenuItems[];
}

export function MobileNav({ open, onClose, menuItems }: Props) {
  const { isAdmin, loggedIn } = useAuth();

  return (
    <>
      <Drawer open={open} onClose={onClose}>
        <div className="mb-2 flex items-center justify-between p-4 z-50">
          <Typography variant="h5" color="blue-gray">
            اسم الشركة
          </Typography>
          <IconButton variant="text" color="blue-gray" onClick={onClose}>
            <XMarkIcon strokeWidth={2} className="h-5 w-5" />
          </IconButton>
        </div>
        <List>
          {menuItems.map(({ href, icon, label }) => {
            return (
              <Link key={href} href={href}>
                <ListItem onClick={onClose}>
                  {label}
                  <ListItemPrefix>{icon}</ListItemPrefix>
                </ListItem>
              </Link>
            );
          })}

          {isAdmin ? (
            <Link href="/dashboard">
              <ListItem onClick={onClose}>
                لوحة التحكم
                <ListItemPrefix>
                  <RectangleGroupIcon className="h-5 w-5" />
                </ListItemPrefix>
              </ListItem>
            </Link>
          ) : null}

          {loggedIn ? (
            
            <SignOutButton>

              <ListItem>
              تسجيل الخروج
                <ListItemPrefix>
                  <PowerIcon className="h-5 w-5" />
                </ListItemPrefix>

              </ListItem>
            </SignOutButton>
          ) : (
            <div className="flex items-center">
              <Link
                className="px-4 py-1 flex-1 text-center"
                href="/auth/signin"
              >
                تسجيل الدخول
              </Link>
              <Link
                className="bg-blue-500 text-white px-4 py-1 rounded flex-1 text-center"
                href="/auth/signup"
              >
                تسجيل
              </Link>
            </div>
          )}
        </List>
      </Drawer>
    </>
  );
}
