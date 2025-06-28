import { Code } from '@/registry/default/ui/code';

export default function Component() {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
                <Code>npm install @reui/ui</Code>
                <Code>pnpm add @reui/ui</Code>
                <Code>yarn add @reui/ui</Code>
            </div>
            <span>
                You can use the <Code>Code</Code> component to display inline code snippets with consistent styling.
            </span>
        </div>
    );
} 