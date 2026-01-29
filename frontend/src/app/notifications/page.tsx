"use client"

import { Bell, Calendar, MessageSquare, Info, Check } from 'lucide-react';
import { User, Notification } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getCurrentUser, getNotifications, markNotificationAsRead } from '@/lib/mockData';
import { useEffect, useState } from 'react';

interface NotificationsProps {
  user: User;
}

export default function Notifications() {
  const [user, setUser] =  useState(null as User | null);
  const [notifications, setNotifications] =  useState<Notification[]>([]);
  const [unreadCount, setUnreadNotifications] = useState(0)

  useEffect(() => { 
      const user : User | null = getCurrentUser()
      setUser(user)
      const notifications : Notification[] = getNotifications(user!.id)
      setNotifications(notifications)
      const unreadCount = notifications.filter(n => !n.read).length;
      setUnreadNotifications(unreadCount)
    }, [])

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'appointment':
        return <Calendar className="h-5 w-5" />;
      case 'review':
        return <MessageSquare className="h-5 w-5" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  const markAsRead = (notificationId: string) => {
    markNotificationAsRead(notificationId);
    window.location.reload(); // Refresh to show updated state
  };

  const markAllAsRead = () => {
    notifications.forEach(n => {
      if (!n.read) markNotificationAsRead(n.id);
    });
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="mb-2">Notifications</h1>
              {unreadCount > 0 && (
                <p className="text-muted-foreground">
                  {unreadCount} notification{unreadCount > 1 ? 's' : ''} non lue{unreadCount > 1 ? 's' : ''}
                </p>
              )}
            </div>
            {unreadCount > 0 && (
              <Button variant="outline" onClick={markAllAsRead}>
                <Check className="mr-2 h-4 w-4" />
                Tout marquer comme lu
              </Button>
            )}
          </div>

          {notifications.length > 0 ? (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <Card 
                  key={notification.id}
                  className={notification.read ? 'opacity-60' : 'border-primary/50'}
                >
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        notification.type === 'appointment' ? 'bg-blue-100 text-blue-600' :
                        notification.type === 'review' ? 'bg-green-100 text-green-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {getIcon(notification.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="line-clamp-1">{notification.title}</h4>
                          {!notification.read && (
                            <Badge variant="default" className="ml-2">Nouveau</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {notification.message}
                        </p>
                        <div className="flex justify-between items-center">
                          <p className="text-xs text-muted-foreground">
                            {new Date(notification.date).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                          {!notification.read && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                            >
                              Marquer comme lu
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Aucune notification pour le moment
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
