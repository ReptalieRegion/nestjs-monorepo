import Image from 'next/image';
import { IDetailPostsData, TPostsInfo } from '<API>';
import FlexList from '@/components/ui/list/FlexList';

const SquareImage = ({ item, index }: { item: TPostsInfo; index: number }) => {
    return (
        <Image
            width={100}
            height={100}
            loading={index < 10 ? 'eager' : 'lazy'}
            src={item.thumbnail.src}
            alt={item.thumbnail.alt}
            style={{
                width: '100%',
                height: 'auto',
                objectFit: 'cover',
                aspectRatio: '1/1',
            }}
        />
    );
};

const PostsList = (data: IDetailPostsData) => {
    return (
        <FlexList
            data={data.posts}
            colCount={3}
            gap={2}
            keyExtractor={({ item, index }) => item.thumbnail.alt + index}
            renderItem={({ item, index }) => <SquareImage item={item} index={index} />}
        />
    );
};

export default PostsList;
