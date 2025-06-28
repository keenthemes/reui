import { Code } from '@/registry/default/ui/code';

export default function Component() {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
                <Code variant="default">Default variant</Code>
                <Code variant="destructive">Destructive variant</Code>
                <Code variant="outline">Outline variant</Code>
            </div>
            <p>
                The code component supports different variants: <Code variant="default">default</Code>, <Code variant="destructive">destructive</Code>, and <Code variant="outline">outline</Code>.
            </p>
        </div>
    );
} 