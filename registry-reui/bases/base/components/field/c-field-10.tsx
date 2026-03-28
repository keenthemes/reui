// Description: Notification preferences form
// Order: 10

import { Checkbox } from "@/registry/bases/base/ui/checkbox"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/registry/bases/base/ui/field"
import { Switch } from "@/registry/bases/base/ui/switch"

export default function Pattern() {
  return (
    <div className="mx-auto w-full max-w-xs">
      <FieldGroup>
        <FieldSet>
          <FieldLegend variant="label">Notification Channels</FieldLegend>
          <FieldGroup className="gap-4">
            <Field orientation="horizontal">
              <FieldContent>
                <FieldTitle>Push Notifications</FieldTitle>
                <FieldDescription>
                  Alerts sent to your device in real time.
                </FieldDescription>
              </FieldContent>
              <Switch id="notif-push" defaultChecked />
            </Field>
            <Field orientation="horizontal">
              <FieldContent>
                <FieldTitle>Email Digest</FieldTitle>
                <FieldDescription>
                  A daily summary of activity sent to your inbox.
                </FieldDescription>
              </FieldContent>
              <Switch id="notif-email" defaultChecked />
            </Field>
            <Field orientation="horizontal">
              <FieldContent>
                <FieldTitle>SMS Alerts</FieldTitle>
                <FieldDescription>
                  Text messages for critical notifications only.
                </FieldDescription>
              </FieldContent>
              <Switch id="notif-sms" />
            </Field>
          </FieldGroup>
        </FieldSet>
        <FieldSeparator />
        <FieldSet>
          <FieldLegend variant="label">Notify me about</FieldLegend>
          <FieldGroup className="gap-4">
            <Field orientation="horizontal">
              <Checkbox id="notif-comments" defaultChecked />
              <FieldContent>
                <FieldTitle>Comments</FieldTitle>
                <FieldDescription>
                  When someone comments on your posts.
                </FieldDescription>
              </FieldContent>
            </Field>
            <Field orientation="horizontal">
              <Checkbox id="notif-mentions" defaultChecked />
              <FieldContent>
                <FieldTitle>Mentions</FieldTitle>
                <FieldDescription>
                  When someone mentions you in a conversation.
                </FieldDescription>
              </FieldContent>
            </Field>
            <Field orientation="horizontal">
              <Checkbox id="notif-updates" />
              <FieldContent>
                <FieldTitle>Product Updates</FieldTitle>
                <FieldDescription>
                  News about new features and improvements.
                </FieldDescription>
              </FieldContent>
            </Field>
          </FieldGroup>
        </FieldSet>
      </FieldGroup>
    </div>
  )
}
