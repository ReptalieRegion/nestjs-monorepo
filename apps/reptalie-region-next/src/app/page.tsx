import { sayHello } from '@reptalie-region/lib';
import { Button } from '@reptalie-region/ui';

export default function Home() {
    return <Button>{sayHello()}</Button>;
}
