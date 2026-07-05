'use client';

import { Modal } from '@shared/components';
import { Button } from '@shared/components/button/button';
import { useState } from 'react';

export default function Page() {
  const [isDefaultModalOpen, setIsDefaultModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  return (
    <main className="flex min-h-screen items-center justify-center gap-16">
      <Button label="기본 모달 열기" onClick={() => setIsDefaultModalOpen(true)} />
      <Button label="확인 모달 열기" mode="secondary_solid" onClick={() => setIsConfirmModalOpen(true)} />

      <Modal open={isDefaultModalOpen} onOpenChange={setIsDefaultModalOpen}>
        <Modal.Content className="w-480">
          <Modal.Header title="헤더 타이틀입니다" className="text-title-sb-24" />
          <Modal.Description className="mt-4 mb-40">서브 텍스트입니다.</Modal.Description>
          <div className="h-240 bg-gray-50" />
          <Modal.Footer className="mt-80">
            <Button label="다음" className="w-full justify-center" onClick={() => setIsDefaultModalOpen(false)} />
          </Modal.Footer>
        </Modal.Content>
      </Modal>

      <Modal open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
        <Modal.Content className="w-418">
          <Modal.Title className="text-title-sb-18 text-center">헤더 타이틀입니다</Modal.Title>
          <Modal.Description className="mt-8 mb-40 text-center">서브 텍스트입니다.</Modal.Description>
          <Modal.Footer>
            <Button
              label="취소"
              mode="secondary_solid"
              className="flex-1 justify-center"
              onClick={() => setIsConfirmModalOpen(false)}
            />
            <Button label="삭제" className="flex-1 justify-center" />
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </main>
  );
}
