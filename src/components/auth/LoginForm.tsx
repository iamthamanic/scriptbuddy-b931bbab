
import React from 'react';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { customSupabase } from "@/integrations/supabase/customClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { PasswordInput } from './PasswordInput';
import { useValidatedForm } from '@/hooks/useValidatedForm';
import { loginSchema, type LoginFormValues } from '@/validation/authSchemas';

interface LoginFormProps {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  onForgotPassword?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ loading, setLoading, onForgotPassword }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const form = useValidatedForm<LoginFormValues, typeof loginSchema>(loginSchema, {
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const handleLogin = async (data: LoginFormValues) => {
    setLoading(true);
    try {
      const { error } = await customSupabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
      });
      
      if (error) throw error;
      
      toast.success(t('auth.success.login'));
      navigate('/');
    } catch (error: any) {
      toast.error(t('auth.error.login'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('common.email')}</FormLabel>
              <FormControl>
                <Input placeholder="name@example.com" type="email" {...field} disabled={loading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('common.password')}</FormLabel>
              <FormControl>
                <PasswordInput field={field} disabled={loading} />
              </FormControl>
              <FormMessage />
              {onForgotPassword && (
                <Button 
                  variant="link" 
                  className="p-0 h-auto font-normal text-xs"
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    onForgotPassword();
                  }}
                >
                  {t('auth.forgotPassword') || 'Forgot password?'}
                </Button>
              )}
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? t('common.loading') : t('common.login')}
        </Button>
      </form>
    </Form>
  );
};
