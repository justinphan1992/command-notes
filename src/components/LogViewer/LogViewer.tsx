import { List, ListRowProps, AutoSizer, CellMeasurerCache, CellMeasurer } from 'react-virtualized';
import { useLogContext } from '../log-provider';
import { useEffect, useState, useRef, Fragment } from 'react';
import { Child, Command } from '@tauri-apps/plugin-shell';
import { useLogViewerSetting } from '../log-view-setting-provider';

const cache = new CellMeasurerCache({
  defaultHeight: 50,
  fixedWidth: true,
});

type HighlightProps = {
  text: string;
  highlights: string[];
};

const Highlight = ({ text, highlights }: HighlightProps) => {
  if (!highlights.length) {
    return <span className='whitespace-pre-wrap text-sm'>{text}</span>; // If there are no highlight words, return the original text
  }

  const regex = new RegExp(`(${highlights.join('|')})`, 'gi'); // Create a regex to match any of the highlight words
  const parts = text.split(regex); // Split text by the highlight words

  return (
    <p className='whitespace-pre-wrap text-sm'>
      {parts.map((part, index) =>
        highlights.some((highlight) => highlight.toLowerCase() === part.toLowerCase()) ? (
          <span key={index} className='bg-yellow-300'>
            {part}
          </span> // Highlighted part with Tailwind CSS class
        ) : (
          <Fragment key={index}>{part}</Fragment> // Non-highlighted part
        ),
      )}
    </p>
  );
};

export const LogViewer = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState('');
  const child = useRef<Child | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { selectedLog } = useLogContext();
  const { getLogViewerSetting } = useLogViewerSetting();
  const { highlightTexts } = getLogViewerSetting(selectedLog?.id || 0);

  useEffect(() => {
    if (!selectedLog) return;
    (async () => {
      try {
        const command = Command.create('exec-sh', ['-c', selectedLog.command]);
        command.on('error', (err) => {
          setError(err);
        });
        command.stdout.on('data', (line) => {
          setLogs((prev) => [...prev, line]);
        });
        command.stderr.on('data', (line) => {
          setLogs((prev) => [...prev, line]);
        });
        child.current = await command.spawn();
      } catch (error) {
        console.log(error);
      }
    })();

    return () => {
      setLogs([]);
      setError('');
      child.current?.kill();
      cache.clearAll();
    };
  }, [selectedLog]);

  function rowRenderer(props: ListRowProps) {
    return (
      <CellMeasurer
        cache={cache}
        columnIndex={0}
        key={props.key}
        parent={props.parent}
        rowIndex={props.index}
      >
        {({ registerChild }) => (
          <div ref={registerChild} style={props.style} className='space-y-2'>
            <Highlight text={logs[props.index]} highlights={highlightTexts} />
          </div>
        )}
      </CellMeasurer>
    );
  }

  return (
    <div
      ref={containerRef}
      className='h-full overflow-y-auto rounded-lg bg-gray-900 p-4 text-white shadow-md'
    >
      {error ? (
        <div className='text-red-500'>{error}</div>
      ) : (
        <AutoSizer onResize={() => cache.clearAll()}>
          {({ height, width }) => (
            <List
              width={width}
              height={height}
              scrollToIndex={logs.length - 1}
              scrollToAlignment='end'
              deferredMeasurementCache={cache}
              rowCount={logs.length}
              rowHeight={cache.rowHeight}
              rowRenderer={rowRenderer}
            />
          )}
        </AutoSizer>
      )}
    </div>
  );
};
