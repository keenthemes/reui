import { Code } from '@/registry/default/ui/code';

export default function Component() {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
                <Code showCopyButton>npm install @reui/ui</Code>
                <Code showCopyButton>pnpm add @reui/ui</Code>
                <Code showCopyButton>yarn add @reui/ui</Code>
            </div>
            <span>
                Use the <Code showCopyButton>showCopyButton</Code> prop to add a copy button that allows users to easily copy the code content.
            </span>
        </div>
    );
} 