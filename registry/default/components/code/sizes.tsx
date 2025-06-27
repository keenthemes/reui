import { Code } from '@/registry/default/ui/code';

export default function Component() {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
                <Code size="sm">Small size</Code>
                <Code size="default">Default size</Code>
                <Code size="lg">Large size</Code>
            </div>
            <p>
                The code component comes in different sizes: <Code size="sm">small</Code>, <Code size="default">default</Code>, and <Code size="lg">large</Code>.
            </p>
        </div>
    );
} 