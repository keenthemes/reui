import { useState } from 'react';
import { Alert, AlertIcon, AlertTitle } from '@/registry/default/ui/alert';
import { Button } from '@/registry/default/ui/button';
import { Input } from '@/registry/default/ui/input';
import { RiCheckboxCircleFill, RiErrorWarningFill } from '@remixicon/react';
import { toast } from 'sonner';
import { trackEvent } from '@/lib/analytics';
import { RecaptchaPopover } from '@/components/recaptcha-popover';

export function SiteSubscribe() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRecaptcha, setShowRecaptcha] = useState(false);

  const validateEmail = () => {
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast.custom(
        () => (
          <Alert variant="mono" icon="destructive">
            <AlertIcon>
              <RiErrorWarningFill />
            </AlertIcon>
            <AlertTitle>Invalid email address. Please check and try again.</AlertTitle>
          </Alert>
        ),
        {
          position: 'top-center',
        },
      );
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateEmail()) {
      setShowRecaptcha(false);
      return;
    }

    setShowRecaptcha(true);
  };

  const handleVerifiedSubmit = async (token: string) => {
    if (!token) {
      toast.custom(
        () => (
          <Alert variant="mono" icon="destructive">
            <AlertIcon>
              <RiErrorWarningFill />
            </AlertIcon>
            <AlertTitle>Please complete the reCAPTCHA verification.</AlertTitle>
          </Alert>
        ),
        {
          position: 'top-center',
        },
      );
      return;
    }

    setLoading(true);
    setShowRecaptcha(false);

    try {
      trackEvent({
        name: 'site_newsletter_subscribe_submit',
        properties: {
          category: 'conversion',
          label: 'Newsletter Subscribe Submit',
          email,
        },
      });

      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-recaptcha-token': token,
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.custom(
          () => (
            <Alert variant="mono" icon="success">
              <AlertIcon>
                <RiCheckboxCircleFill />
              </AlertIcon>
              <AlertTitle>Thank you for your subscription. Expect amazing stuff soon!</AlertTitle>
            </Alert>
          ),
          {
            position: 'top-center',
          },
        );
        trackEvent({
          name: 'site_newsletter_subscribe_success',
          properties: {
            category: 'conversion',
            label: 'Newsletter Subscribe Success',
            email,
          },
        });
        setEmail('');
      } else {
        toast.custom(
          () => (
            <Alert variant="mono" icon="destructive">
              <AlertIcon>
                <RiErrorWarningFill />
              </AlertIcon>
              <AlertTitle>{data.message || 'Oops! Something unexpected happened. Please try again later.'}</AlertTitle>
            </Alert>
          ),
          {
            position: 'top-center',
          },
        );
      }
    } catch (err: unknown) {
      console.error('Newsletter subscription error:', err);
      toast.custom(
        () => (
          <Alert variant="mono" icon="destructive">
            <AlertIcon>
              <RiErrorWarningFill />
            </AlertIcon>
            <AlertTitle>Oops! Something unexpected happened. Please try again later.</AlertTitle>
          </Alert>
        ),
        {
          position: 'top-center',
        },
      );
    } finally {
      setLoading(false);
    }
  };

  const style = {
    backgroundImage: `linear-gradient(0deg, transparent 0%, transparent 60%, rgba(183, 183, 183, 0.05) 60%, rgba(183, 183, 183, 0.05) 93%, transparent 93%, transparent 100%),
                      linear-gradient(135deg, transparent 0%, transparent 55%, rgba(183, 183, 183, 0.05) 55%, rgba(183, 183, 183, 0.05) 84%, transparent 84%, transparent 100%),
                      linear-gradient(0deg, transparent 0%, transparent 80%, rgba(183, 183, 183, 0.05) 80%, rgba(183, 183, 183, 0.05) 94%, transparent 94%, transparent 100%),
                      linear-gradient(90deg, rgb(0,0,0), rgb(0,0,0))`,
  };

  return (
    <footer>
      <div className="container pt-10">
        <div
          className="flex items-center flex-wrap justify-between gap-7 px-10 md:px-20 py-16 rounded-xl mt-10 mb-8"
          style={style}
        >
          <div className="flex flex-col gap-1.5">
            <h2 className="text-white text-3xl font-medium">Stay notified on every new release</h2>
            <div className="text-white/50 text-2xl font-medium">Only the updates worth knowing</div>
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2.5">
            <Input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setShowRecaptcha(false);
              }}
              placeholder="Your email address"
              className="md:min-w-64 h-auto px-5 py-3 border border-input/20 focus:outline-none focus:ring rounded-lg bg-white/5 text-white/80 placeholder:text-white/50"
              required
            />

            <RecaptchaPopover
              open={showRecaptcha}
              onOpenChange={(open) => {
                if (!open) {
                  setShowRecaptcha(false);
                }
              }}
              onVerify={handleVerifiedSubmit}
              verifyButtonText="Verify & Subscribe"
              trigger={
                <Button
                  type="submit"
                  className="font-semibold rounded-lg h-auto px-5 py-3 bg-white hover:bg-white text-black/80 hover:text-black"
                  disabled={loading}
                >
                  {loading ? 'Subscribing...' : 'Subscribe'}
                </Button>
              }
            />
          </form>
        </div>
      </div>
    </footer>
  );
}
