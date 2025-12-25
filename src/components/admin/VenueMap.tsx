"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { VenueWithCount, User, Photo } from "@/types/database";
import { getVisitorsByVenue } from "@/actions/visitors";
import { getPhotosByUserId } from "@/actions/photos";
import Image from "next/image";

interface VenueMapProps {
  venues: VenueWithCount[];
  darkMode?: boolean;
}

export function VenueMap({ venues, darkMode = false }: VenueMapProps) {
  const [selectedVenue, setSelectedVenue] = useState<string | null>(null);
  const [visitors, setVisitors] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // ユーザー詳細モーダル用
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userPhotos, setUserPhotos] = useState<Photo[]>([]);
  const [loadingPhotos, setLoadingPhotos] = useState(false);

  // 写真拡大表示用
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const venueOrder = ["homeplanet", "movement", "astro"];

  const handleVenueClick = async (venueId: string) => {
    console.log("会場をクリックしました:", venueId);
    setLoading(true);
    setSelectedVenue(venueId);
    const data = await getVisitorsByVenue(venueId);
    console.log("取得したデータ:", data);
    setVisitors(data as User[]);
    setLoading(false);
  };

  const handleCloseModal = () => {
    setSelectedVenue(null);
    setVisitors([]);
  };

  const handleUserClick = async (user: User) => {
    console.log("ユーザーをクリックしました:", user.nickname);
    setLoadingPhotos(true);
    setSelectedUser(user);
    const photos = await getPhotosByUserId(user.id);
    console.log("取得した写真:", photos);
    setUserPhotos(photos);
    setLoadingPhotos(false);
  };

  const handleCloseUserDetail = () => {
    setSelectedUser(null);
    setUserPhotos([]);
  };

  const handlePhotoClick = (photoUrl: string) => {
    setSelectedPhoto(photoUrl);
  };

  const handleClosePhoto = () => {
    setSelectedPhoto(null);
  };

  const bgClass = darkMode
    ? "relative w-full h-96 bg-black/20 rounded-lg border-2 border-white/10 overflow-hidden"
    : "relative w-full h-96 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg border-2 border-gray-300 overflow-hidden";

  const gridClass = darkMode
    ? "border border-white/10"
    : "border border-gray-400";
  const countBgClass = darkMode
    ? "bg-white/10 border-white/20 backdrop-blur-sm"
    : "bg-white border-gray-200";
  const countTextClass = darkMode ? "text-white" : "text-gray-900";
  const countSubtextClass = darkMode ? "text-gray-400" : "text-gray-600";

  return (
    <div className="w-full">
      {/* 説明文 */}
      <div
        className={`text-center mb-4 ${
          darkMode ? "text-gray-300" : "text-gray-700"
        }`}
      >
        <p className="text-sm">会場をタップして来場者をチェック</p>
      </div>

      {/* 会場を縦に並べる */}
      <div className="space-y-3">
        {venueOrder.map((venueId) => {
          const venue = venues.find((v) => v.id === venueId);
          if (!venue) return null;

          const borderColor =
            venue.id === "homeplanet"
              ? "#8b5555" // 灰色がかった赤
              : venue.id === "movement"
              ? "#558b55" // 灰色がかった緑
              : "#55658b"; // 灰色がかった青

          return (
            <button
              key={venue.id}
              onClick={() => handleVenueClick(venue.id)}
              className={`w-full flex items-center justify-between p-4 rounded-lg shadow-lg hover:scale-[1.02] transition-all cursor-pointer border-2 ${
                darkMode ? "glass-effect" : "bg-gray-50"
              }`}
              style={{
                borderColor: borderColor,
              }}
            >
              {/* 会場名 */}
              <div className="flex-grow text-left">
                <div
                  className={`font-bold text-lg ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {venue.name}
                </div>
              </div>

              {/* 人数表示 */}
              <div
                className={`${countBgClass} rounded-lg px-4 py-2 shadow-md border-2`}
              >
                <div className="text-center">
                  <div className={`text-2xl font-bold ${countTextClass}`}>
                    {String(venue.current_count)}
                  </div>
                  <div className={`text-xs ${countSubtextClass}`}>人</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* 地図画像 */}
      <div className="mt-6">
        <Image
          src="/map.jpg"
          alt="イベントマップ"
          width={1600}
          height={900}
          className="w-full h-auto rounded-lg shadow-lg"
          unoptimized
        />
      </div>

      {/* モーダル（Portal経由でbodyに表示） */}
      {mounted &&
        selectedVenue &&
        createPortal(
          <div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[9999]"
            onClick={handleCloseModal}
          >
            <div
              className={
                darkMode
                  ? "dark-card rounded-lg p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto shadow-2xl"
                  : "bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto shadow-2xl"
              }
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3
                  className={
                    darkMode
                      ? "text-xl font-bold text-white glow-text"
                      : "text-xl font-bold text-gray-900"
                  }
                >
                  {venues.find((v) => v.id === selectedVenue)?.name ||
                    selectedVenue}
                  の来場者
                </h3>
                <button
                  onClick={handleCloseModal}
                  className={
                    darkMode
                      ? "text-gray-400 hover:text-gray-200 text-2xl font-bold leading-none"
                      : "text-gray-500 hover:text-gray-700 text-2xl font-bold leading-none"
                  }
                >
                  ×
                </button>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className={darkMode ? "text-gray-400" : "text-gray-600"}>
                    読み込み中...
                  </div>
                </div>
              ) : visitors.length === 0 ? (
                <div className="text-center py-8">
                  <div className={darkMode ? "text-gray-400" : "text-gray-600"}>
                    この会場には誰もいません
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  {visitors.map((visitor) => (
                    <div
                      key={visitor.id}
                      onClick={() => handleUserClick(visitor)}
                      className={
                        darkMode
                          ? "flex flex-col items-center p-3 glass-effect rounded-lg hover:bg-white/10 transition cursor-pointer"
                          : "flex flex-col items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                      }
                    >
                      <div className="w-full aspect-square relative rounded-lg overflow-hidden mb-2">
                        <Image
                          src={visitor.icon_image_url}
                          alt={visitor.nickname}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="text-center w-full">
                        <div
                          className={
                            darkMode
                              ? "font-medium text-white text-sm truncate"
                              : "font-medium text-gray-900 text-sm truncate"
                          }
                        >
                          {visitor.nickname}
                        </div>
                        {visitor.instagram_id && (
                          <div
                            className={
                              darkMode
                                ? "text-xs text-gray-400 truncate"
                                : "text-xs text-gray-600 truncate"
                            }
                          >
                            @{visitor.instagram_id}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6 text-center">
                <button
                  onClick={handleCloseModal}
                  className={
                    darkMode
                      ? "px-6 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition border border-white/20"
                      : "px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                  }
                >
                  閉じる
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* ユーザー詳細モーダル（Portal経由でbodyに表示） */}
      {mounted &&
        selectedUser &&
        createPortal(
          <div
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[10000]"
            onClick={handleCloseUserDetail}
          >
            <div
              className={
                darkMode
                  ? "dark-card rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[85vh] overflow-y-auto shadow-2xl"
                  : "bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[85vh] overflow-y-auto shadow-2xl"
              }
              onClick={(e) => e.stopPropagation()}
            >
              {/* ヘッダー */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 relative rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={selectedUser.icon_image_url}
                      alt={selectedUser.nickname}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3
                      className={
                        darkMode
                          ? "text-2xl font-bold text-white glow-text"
                          : "text-2xl font-bold text-gray-900"
                      }
                    >
                      {selectedUser.nickname}
                    </h3>
                    {selectedUser.instagram_id && (
                      <a
                        href={`https://instagram.com/${selectedUser.instagram_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={
                          darkMode
                            ? "text-sm text-blue-400 hover:text-blue-300"
                            : "text-sm text-blue-600 hover:text-blue-700"
                        }
                      >
                        @{selectedUser.instagram_id}
                      </a>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleCloseUserDetail}
                  className={
                    darkMode
                      ? "text-gray-400 hover:text-gray-200 text-3xl font-bold leading-none"
                      : "text-gray-500 hover:text-gray-700 text-3xl font-bold leading-none"
                  }
                >
                  ×
                </button>
              </div>

              {/* 投稿写真 */}
              <div className="mb-4">
                <h4
                  className={
                    darkMode
                      ? "text-lg font-semibold text-white mb-4"
                      : "text-lg font-semibold text-gray-900 mb-4"
                  }
                >
                  投稿した写真
                </h4>

                {loadingPhotos ? (
                  <div className="text-center py-12">
                    <div
                      className={darkMode ? "text-gray-400" : "text-gray-600"}
                    >
                      読み込み中...
                    </div>
                  </div>
                ) : userPhotos.length === 0 ? (
                  <div className="text-center py-12">
                    <div
                      className={darkMode ? "text-gray-400" : "text-gray-600"}
                    >
                      まだ写真を投稿していません
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {userPhotos.map((photo) => (
                      <div
                        key={photo.id}
                        onClick={() => handlePhotoClick(photo.image_url)}
                        className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer"
                      >
                        <Image
                          src={photo.image_url}
                          alt="投稿写真"
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        {photo.approved && (
                          <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                            承認済み
                          </div>
                        )}
                        {/* クリック可能を示すオーバーレイ */}
                        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity duration-300 flex items-center justify-center">
                          <div className="text-white text-4xl">🔍</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 閉じるボタン */}
              <div className="mt-6 text-center">
                <button
                  onClick={handleCloseUserDetail}
                  className={
                    darkMode
                      ? "px-8 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition border border-white/20"
                      : "px-8 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                  }
                >
                  閉じる
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* 写真拡大表示ライトボックス（Portal経由でbodyに表示） */}
      {mounted &&
        selectedPhoto &&
        createPortal(
          <div
            className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-[10001]"
            onClick={handleClosePhoto}
          >
            {/* 閉じるボタン */}
            <button
              onClick={handleClosePhoto}
              className="absolute top-4 right-4 text-white text-5xl font-bold hover:text-gray-300 transition z-10"
            >
              ×
            </button>

            {/* 拡大写真 */}
            <div className="relative w-full h-full flex items-center justify-center p-8">
              <div className="relative max-w-7xl max-h-full w-full h-full">
                <Image
                  src={selectedPhoto}
                  alt="拡大写真"
                  fill
                  className="object-contain"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>

            {/* ヒントテキスト */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black bg-opacity-50 px-4 py-2 rounded">
              クリックで閉じる
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
